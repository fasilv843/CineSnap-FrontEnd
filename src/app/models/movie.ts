/* eslint-disable @typescript-eslint/member-delimiter-style */

import { type IApiRes } from './common'
import { type genreType, type langType } from './filter'

/* eslint-disable @typescript-eslint/indent */
export interface IMovie {
    _id: string
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    language: string
    tmdbId: number
    release_date: Date
    genre_ids: number[]
    review?: MovieReview[]
    isDeleted?: boolean
}

export interface ICSMovieRes {
    _id: string
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview?: string
    language: langType
    duration: IDuration
    tmdbId: number
    release_date: Date
    genre_ids: genreType[]
    review?: MovieReview[]
    isDeleted: boolean
}

export type Movie = Omit<IMovie, '_id'>

export interface ITMDBMovie {
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    original_language: string
    id: number
    release_date: Date
    genre_ids: genreType[]
    adult: boolean
}

export interface IMoviesObj {
    page: number;
    results: ITMDBMovie[];
    total_pages: number;
    total_results: number;
}

interface MovieReview {
    rating: number
    review: string
    userId: string
}
export interface IApiCSMovieRes extends IApiRes<ICSMovieRes> {}
export interface IApiCSMoviesRes extends IApiRes<ICSMovieRes[]> {}

export interface IDuration {
    hours: number,
    minutes: number
}
