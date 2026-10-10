"""Crawl every user/theater/admin route and report runtime errors.

Usage: python -I e2e/crawl.py   (needs `ng serve` on :4200 and the backend on :3000)
"""
import json
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:4200'
PASSWORD = 'Test@1234'
USER_EMAIL = 'qa.user.cinesnap@example.com'
THEATER_EMAIL = 'qa.theater.cinesnap@example.com'

# Errors that are known backend issues, not frontend regressions
KNOWN_NOISE = ('socket.io', 'CORS', 'qr', 'Failed to load resource')

ANGULAR_ERRORS = ('NG0', 'NullInjector', 'is not a known element', "Can't bind to")


def login(page, role, email):
    page.goto(f'{BASE}/{role}/login')
    page.fill('[formControlName="email"]', email)
    page.fill('[formControlName="password"]', PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_url(lambda url: '/login' not in url, timeout=15000)


def entity_id(page, key, details_key):
    state = json.loads(page.evaluate("localStorage.getItem('state')") or '{}')
    details = (state.get(key) or {}).get(details_key) or {}
    return details.get('_id', 'unknown')


def visit(page, path, errors, expect_path=None):
    page.goto(f'{BASE}{path}')
    page.wait_for_load_state('load')
    page.wait_for_timeout(1500)
    landed = page.url.replace(BASE, '')
    ok_path = expect_path is None or landed.startswith(expect_path)
    angular = [e for e in errors if any(a in e for a in ANGULAR_ERRORS)]
    other = [e for e in errors if e not in angular and not any(n in e for n in KNOWN_NOISE)]
    status = 'OK ' if ok_path and not angular else 'ERR'
    print(f'{status} {path:45} -> {landed:40} title="{page.title()}"')
    for e in angular:
        print(f'      angular: {e[:300]}')
    for e in other:
        print(f'      other:   {e[:200]}')
    errors.clear()
    return status == 'OK '


def run():
    failures = 0
    with sync_playwright() as p:
        browser = p.chromium.launch()

        def new_page():
            ctx = browser.new_context()
            page = ctx.new_page()
            errors = []
            page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.on('dialog', lambda d: d.dismiss())
            return page, errors

        print('--- logged out')
        page, errors = new_page()
        for path, expect in [
            ('/', '/user/home'), ('/user/login', '/user/login'), ('/user/register', '/user/register'),
            ('/theater/home', '/theater/login'), ('/theater/register', '/theater/register'),
            ('/admin/home', '/admin/login'), ('/admin/login', '/admin/login'),
            ('/user/profile', None), ('/does-not-exist', '/does-not-exist'),
        ]:
            failures += not visit(page, path, errors, expect)
        page.goto(f'{BASE}/user/profile')
        page.wait_for_timeout(1000)
        prompt = page.locator('.swal2-title', has_text='You are not logged in').count() > 0
        print(f'{"OK " if prompt else "ERR"} auth guard prompt on /user/profile (logged out): {prompt}')
        failures += not prompt
        errors.clear()

        print('--- user')
        page, errors = new_page()
        login(page, 'user', USER_EMAIL)
        user_id = entity_id(page, 'user', 'userDetails')
        for path in ['/user/home', '/user/movies', '/user/theaters', '/user/profile',
                     f'/user/profile/edit/{user_id}', '/user/profile/wallet-history',
                     f'/user/bookings/{user_id}', '/user/messages']:
            failures += not visit(page, path, errors, path)
        failures += not visit(page, '/user/login', errors, '/user/home')

        print('--- theater')
        page, errors = new_page()
        login(page, 'theater', THEATER_EMAIL)
        theater_id = entity_id(page, 'theater', 'theaterDetails')
        for path in ['/theater/home', '/theater/shows', '/theater/screens', '/theater/movies',
                     '/theater/profile', f'/theater/profile/edit/{theater_id}',
                     '/theater/profile/wallet-history', f'/theater/tickets/{theater_id}',
                     '/theater/coupons', '/theater/messages']:
            failures += not visit(page, path, errors, path)
        failures += not visit(page, '/theater/login', errors, '/theater/home')

        browser.close()
    print(f'\n{failures} failure(s)')
    return failures


if __name__ == '__main__':
    sys.exit(1 if run() else 0)
