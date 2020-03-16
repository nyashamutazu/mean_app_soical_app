import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class PostService {
    private posts: Post[] = [];
    // tslint:disable-next-line:new-parens
    private postUpdated = new Subject <{ posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = (`?currentpage=${currentPage}&pagesize=${postsPerPage}` as string);
        // sending an http reques, using http (get request) -> information is on the server side
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
        // including map function from the rxJs
        .pipe(map((postData) => {
            // map is used as a loop for each object in array
            return {posts: postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator: post.creator
                };
            }), maxPosts: +postData.maxPosts};
        }))
        // subscribing to the data that is transformed by the _id to id
        .subscribe((transformedPostData) => {
           this.posts = transformedPostData.posts;
           this.postUpdated.next({ posts: this.posts.slice(), postCount: transformedPostData.maxPosts});
        });
    }

    getPost(id: string) {
        return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string }>(
            'http://localhost:3000/api/posts/' + id);

        // return this.posts.slice().find(
        //     p => p.id === id
        // );
    }

    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    addPosts(postRecieved: {id: any, title: string, content: string, image: File}) {
        const postData = new FormData();
        postData.append('title', postRecieved.title);
        postData.append('content', postRecieved.content);
        postData.append('image', postRecieved.image, postRecieved.title);

        // passing the post to the server
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        // must subscribe otherwise nothing will happen
        .subscribe((responseData) => {
            // const post: Post = {
            //     id: responseData.post.id,
            //     title: responseData.post.title,
            //     content: responseData.post.content,
            //     imagePath: responseData.post.imagePath,
            // };
            // // updated posts if the reponse was successful
            // this.posts.push(post);
            // this.postUpdated.next(this.posts.slice());
            this.router.navigate(['/']);
        });
    }

    updatePost(post: {id: string, title: string, content: string, imagePath: File | string}) {
        let postData: Post | FormData;
        if (typeof post.imagePath === 'object') {
            postData = new FormData();
            postData.append('id', post.id);
            postData.append('title', post.title);
            postData.append('content', post.content);
            postData.append('image', post.imagePath);
        } else {
            postData = {
                id: post.id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
                creator: null
            };
        }

        this.http.put<{message: string}>('http://localhost:3000/api/posts/' + post.id, postData)
        .subscribe((responseData) => {
            // const updatedPosts = this.posts.slice();
            // const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
            // const postNew: Post = {
            //     id: post.id,
            //     title: post.title,
            //     content: post.content,
            //     imagePath: ''
            // };
            // updatedPosts[oldPostIndex] = postNew;
            // this.posts = updatedPosts;
            // this.postUpdated.next(this.posts.slice());
            this.router.navigate(['/']);
        });
    }

    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId)
        // .subscribe(() => {
        //   const updatedPosts = this.posts.filter(post => post.id !== postId);
        //   this.posts = updatedPosts;
        //   this.postUpdated.next(this.posts.slice());
        // })
        ;
    }

}

