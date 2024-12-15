import { GeoPoint } from "firebase/firestore";

export interface IExhibition {
    id: string;
    title: string;
    description: string;
    host: string;
    //tried to use date: Date, but had troubles with formatting.
    //will not be adding functionality to create exhibitions, so will use string for now.
    date: string;
    location: GeoPoint;
    imageUrl: string;
    hashtags: string[];
    postIDs: string[];
}

export interface IExhibitionResponse {
    exhibition_by_id: IExhibition;
}

export interface IExhibitionsResponse {
    exhibitions: IExhibition[];
}