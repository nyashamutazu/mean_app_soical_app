import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mineType } from './mine-type-validators';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  id: string;
  editMode = false;
  post: Post;
  loading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(private postService: PostService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mineType]})
    });
    this.route.params.subscribe(
      (params: Params) => {
        // tslint:disable-next-line:no-string-literal
        this.id = params['id'];

        if (this.id) {
          this.editMode = true;
          this.loading = true;
          this.postService.getPost(this.id)
          .subscribe((response) => {
            this.loading = false;
            this.post = {
              id: response._id,
              title: response.title,
              content: response.content,
              imagePath: response.imagePath,
              creator: response.creator
            };
            this.form.setValue({title: this.post.title, content: this.post.content, image: this.post.imagePath});
          });
        } else {
          this.editMode = false;
        }

        // if (this.editMode === true) {
        //   this.post = this.postService.getPost(this.id);
        // }
      });
    }

    // Storing different forms of data using reactiveForm storing data as HTMLInputElement
  onImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = (reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  onSubmitComment() {
    this.loading = true;
    if (this.form.invalid) {
      return;
    } else if (this.editMode === false) {
      this.postService.addPosts(this.form.value);
      this.form.reset();
    } else if (this.editMode === true) {
      const post: Post = {
        id: this.id,
        title: this.form.value.title,
        content: this.form.value.content,
        imagePath: this.form.value.image,
        creator: null
      };
      this.postService.updatePost(post);
      this.form.reset();
    }
    return;
  }
}
