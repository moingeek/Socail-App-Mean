import { Component , OnInit, OnDestroy } from '@angular/core';
import {Subscription} from 'rxjs';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

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
  private postsSub: Subscription;

  constructor(public postsService: PostService ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.isLoading = false;
      this.posts = posts;
    });
  }

  onDelete(postid: string) {
    this.postsService.deletePost(postid);
  }


  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
