import { Component , OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import {Subscription} from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl : './post-list.component.html',
  styleUrls : ['./post-list.component.css']
})

export default class PostListComponent implements OnInit , OnDestroy {
  // posts = [
  //   {title : '1st Post' , content: 'Post 1'},
  //   {title : '2nd Post' , content: 'Post 2'},
  //   {title : '3rd Post' , content: 'Post 3'},
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOption = [1, 2, , 5, 10];
  userisAuthenticated = false;
  private postsSub: Subscription;
  private authStatausSub: Subscription;

  constructor(public postsService: PostService, private authService: AuthService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userisAuthenticated = this.authService.getIsAuth();
    this.authStatausSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userisAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
  }

  onDelete(postid: string) {
    this.isLoading = true;
    this.postsService.deletePost(postid).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage);
    });
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatausSub.unsubscribe();
  }
}
