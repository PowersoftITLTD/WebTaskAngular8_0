import { Component } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  comment: string = '';
  comments = [
    {
      author: 'Pooja Kumhar',
      time: '23 hrs ago',
      mention: 'Dhanashree',
      text: 'Cool will check and mark status',
      avatar: 'assets/assignees1.png',
    },
    {
      author: 'Dhanashri Patil',
      time: '24 hrs ago',
      mention: 'Pooja',
      text: 'Hey, yes those were completed yesterday',
      avatar: 'assets/assignees1.png',
    },
    {
      author: 'Pooja Kumhar',
      time: '1 Day ago',
      mention: 'Dhanashree',
      text: 'Hii, are the tasks completed?',
      avatar: 'assets/assignees1.png',
    },
  ];
}
