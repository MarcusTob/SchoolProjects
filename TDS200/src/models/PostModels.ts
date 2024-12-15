export interface IPost {
    id: string;
    title: string;
    description: string;
    author: string;
    exhibition: string;
    imageUrl: string;
    hashtags: string[];
    createdAt: string;
    likeAmount: string;
    likedBy: string[];
}

export interface IPostResponse {
    post_by_id: IPost;
}

export interface IPostsResponse {
    posts: IPost[];
}

export interface INewPost {
    id: string;
    title: string;
    description: string;
    author: string;
    exhibition: string;
    imageUrl: string;
    hashtags: string[];
    createdAt: string;
    likeAmount: string;
    likedBy: string[];
}