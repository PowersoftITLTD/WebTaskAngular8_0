import { Component, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-tm-tree-view',
  templateUrl: './tm-tree-view.component.html',
  styleUrl: './tm-tree-view.component.scss'
})
export class TmTreeViewComponent {
  @Input() treeData: any[] = [];
  @Input() customClass: any = '';
  nestedColumns: Array<any> = [1,2,4,5,6,7]
  tableData: TreeNode[] = [
    {
      data: {
        label: 'T1',
        size: '3 KB',
        type: 'Folder',
      },
      children: [
        {
          data: {
            label: 'T1.1',
            size: '2 KB',
            type: 'Folder',
          },
          children: [
            {
              data: { label: 'T1.1.1', size: '1 KB', type: 'File' },
            },
            {
              data: { label: 'T1.1.2', size: '1 KB', type: 'File' },
            },
          ],
        },
        {
          data: { label: 'T1.2', size: '2 KB', type: 'File' },
        },
      ],
    },
    {
      data: { label: 'T2', size: '4 KB', type: 'Folder' },
    },
  ];
}
