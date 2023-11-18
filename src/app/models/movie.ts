/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
export interface IMovie {
    _id?: string
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

interface ITMDBMovie {
    title: string
    original_title?: string
    poster_path: string
    backdrop_path?: string
    overview: string
    original_language: string
    id: number
    release_date: Date
    genre_ids: number[]
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

export interface CSMovieRes {
    message: string
    movies: IMovie[]
}
