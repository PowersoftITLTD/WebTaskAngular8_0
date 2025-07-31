import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksListComponent } from './tasks-list/tasks-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TasksBoardComponent } from './tasks-board/tasks-board.component';
import { BadgeModule } from 'primeng/badge';
import { TasksTimelineComponent } from './tasks-timeline/tasks-timeline.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { TasksAddComponent } from './tasks-add/tasks-add.component';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { AccordionModule } from 'primeng/accordion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';

import { TasksProgressComponent } from './tasks-progress/tasks-progress.component';
import { TasksDetailsComponent } from './tasks-details/tasks-details.component';
import { BreadcrumbsComponent } from '../../shared/components/common/breadcrumbs/breadcrumbs.component';
import { TaskDetailCardComponent } from './task-detail-card/task-detail-card.component';
import { AddSubTasksComponent } from './task-details/add-sub-tasks/add-sub-tasks.component';
import { CommentComponent } from './task-details/comment/comment.component';
import { UpdateProgressComponent } from './task-details/update-progress/update-progress.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'task-list',
  },
  {
    path: 'task-list',
    component: TasksListComponent,
  },
  {
    path: 'task-details/:id',
    component: TasksDetailsComponent,
  },
];

@NgModule({
  declarations: [
    TasksListComponent,
    TasksBoardComponent,
    TasksTimelineComponent,
    TasksAddComponent,
    TasksProgressComponent,
    TasksDetailsComponent,
    TaskDetailCardComponent,
    AddSubTasksComponent,
    CommentComponent,
    UpdateProgressComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    ButtonModule,
    MenuModule,
    BadgeModule,
    TooltipModule,
    SidebarModule,
    InputTextModule,
    EditorModule,
    OverlayPanelModule,
    ListboxModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    AccordionModule,
    IconFieldModule,
    InputIconModule,
    CheckboxModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ChipsModule,
  ],
})
export class TasksModule {}
