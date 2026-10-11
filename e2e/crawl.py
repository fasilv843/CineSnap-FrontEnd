"""Crawl every user/theater/admin route and report runtime errors.

Usage: python -I e2e/crawl.py   (needs `ng serve` on :4200 and the backend on :3000)
The admin section runs when CS_ADMIN_EMAIL and CS_ADMIN_PASSWORD are set in the environment.
"""
import json
import os
import sys

from playwright.sync_api import sync_playwright

BASE = 'http://localhost:4200'
PASSWORD = 'Test@1234'
USER_EMAIL = 'qa.user.cinesnap@example.com'
THEATER_EMAIL = 'qa.theater.cinesnap@example.com'
THEATER_ID = '6ac9cfe4831c6ea7f502223f'
SHOW_ID = '6ac9d07d831c6ea7f5022298'
SHOW_SEAT_ID = '6ac9d07c831c6ea7f5022262'
ADMIN_EMAIL = os.environ.get('CS_ADMIN_EMAIL')
ADMIN_PASSWORD = os.environ.get('CS_ADMIN_PASSWORD')

# Errors that are known backend issues, not frontend regressions
KNOWN_NOISE = ('socket.io', 'CORS', 'qr', 'Failed to load resource')

ANGULAR_ERRORS = ('NG0', 'NullInjector', 'is not a known element', "Can't bind to")


def login(page, role, email, password=PASSWORD):
    page.goto(f'{BASE}/{role}/login')
    page.fill('[formControlName="email"]', email)
    page.fill('[formControlName="password"]', password)
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
            # Close the previous role's context so memory doesn't pile up across sections
            for old in browser.contexts:
                old.close()
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
            ('/', '/'), ('/user/login', '/user/login'), ('/user/register', '/user/register'),
            ('/theater/home', '/theater/login'), ('/theater/register', '/theater/register'),
            ('/admin/home', '/admin/login'), ('/admin/login', '/admin/login'),
            ('/theater/approval/pending', '/theater/approval/pending'),
            ('/theater/approval/rejected?reason=Rejection', '/theater/approval/rejected'),
            ('/theater/approval/rejected', '/theater/approval/rejected'),
            ('/user/home', '/user/home'), ('/user/movies', '/user/movies'), ('/user/theaters', '/user/theaters'),
            (f'/user/theater/{THEATER_ID}', f'/user/theater/{THEATER_ID}'),
            (f'/user/show/seats/{SHOW_SEAT_ID}?showId={SHOW_ID}&theaterId={THEATER_ID}', '/user/show/seats'),
            ('/user/profile', '/user/login'), ('/does-not-exist', '/does-not-exist'),
        ]:
            failures += not visit(page, path, errors, expect)
        page.goto(f'{BASE}/')
        page.wait_for_load_state('load')
        for href in ['/user/register', '/user/login', '/theater/login', '/theater/register', '/admin/login']:
            found = page.locator(f'a[href="{href}"]').count() > 0
            print(f'{"OK " if found else "ERR"} landing link {href}: {found}')
            failures += not found
        page.locator('main a[href="/user/login"]').click()
        page.wait_for_url(f'{BASE}/user/login', timeout=10000)
        print('OK  landing "Log in" opens /user/login')
        errors.clear()

        page.goto(f'{BASE}/user/profile')
        page.wait_for_timeout(1000)
        prompt = '/user/login' in page.url and page.get_by_text('Log in to continue').count() > 0
        print(f'{"OK " if prompt else "ERR"} auth guard sends /user/profile to login with a toast (logged out): {prompt}')
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
        page.goto(f'{BASE}/theater/screens')
        page.wait_for_timeout(2000)
        layout = page.get_by_role('link', name='Seat layout').first
        if layout.count() > 0:
            failures += not visit(page, layout.get_attribute('href'), errors, '/theater/screens/seat/')
        failures += not visit(page, '/theater/login', errors, '/theater/home')

        if ADMIN_EMAIL and ADMIN_PASSWORD:
            print('--- admin')
            page, errors = new_page()
            login(page, 'admin', ADMIN_EMAIL, ADMIN_PASSWORD)
            for path in ['/admin/home', '/admin/theaters', '/admin/users', '/admin/tickets',
                         '/admin/movies/tmdb', '/admin/movies/cinesnap', '/admin/movies/ml', '/admin/messages']:
                failures += not visit(page, path, errors, path)
            failures += not visit(page, '/admin/movies', errors, '/admin/movies/tmdb')
            failures += not visit(page, '/admin/login', errors, '/admin/home')
        else:
            print('--- admin skipped (set CS_ADMIN_EMAIL and CS_ADMIN_PASSWORD)')

        browser.close()
    print(f'\n{failures} failure(s)')
    return failures


if __name__ == '__main__':
    sys.exit(1 if run() else 0)
