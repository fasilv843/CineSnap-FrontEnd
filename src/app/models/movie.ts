/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/indent */
export interface IMovie {
    backdrop_path: string;
    id: number;
    original_title: string;
    overview: string;
    poster_path: string;
}

export interface IMoviesObj {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}
