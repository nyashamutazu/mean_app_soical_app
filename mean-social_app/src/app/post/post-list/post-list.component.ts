import { PostService } from './../post.service';
import { Component, OnInit, OnDestroy } from '@angular/core';


import { Post } from '../post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  loading = false;

  totalPosts = 0;
  postPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;

  private postSub: Subscription;
  private authListenerSubs: Subscription;
  isUserAuthenticated = false;

  userId: string;


  constructor(private postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;
    this.postService.getPosts(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[],  postCount: number} ) => {
        this.loading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.isUserAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService.getAuthStatusListner()
    .subscribe(authentication => {
      this.isUserAuthenticated = authentication;
      this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authListenerSubs.unsubscribe();
  }

  onEditComment() {}

  onDeleteComment(id: string) {
    this.loading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postPerPage, this.currentPage);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPosts(this.postPerPage, this.currentPage);
  }

}
