import { Component } from '@angular/core';
import moment from 'moment';

interface Task {
  name: string;
  start: moment.Moment;
  end: moment.Moment;
  status: 'notStarted' | 'inProcess' | 'completed';
  profileUrls: string[];
}

@Component({
  selector: 'app-tasks-timeline',
  templateUrl: './tasks-timeline.component.html',
  styleUrl: './tasks-timeline.component.scss',
})
export class TasksTimelineComponent {
  selectedYear = 2024;
  selectedMonth = 0; // January
  years = [2023, 2024, 2025];
  months = moment.months();
  days: { dayNumber: number; dayName: string }[] = [];
  filteredTasks: Task[] = [];
  rowHeight = 60;
  tasksContainerHeight = '400px';

  tasks: Task[] = [
    // Cross-year task (should appear in Jan 2024)
    {
      name: 'Annual Report',
      start: moment('2023-12-20'),
      end: moment('2024-01-05'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Multiple overlapping tasks
    {
      name: 'UI Overhaul',
      start: moment('2024-01-05'),
      end: moment('2024-01-15'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    {
      name: 'API Migration',
      start: moment('2024-01-10'),
      end: moment('2024-01-20'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Cross-month task
    {
      name: 'Feature Rollout',
      start: moment('2024-01-25'),
      end: moment('2024-02-10'),
      status: 'notStarted',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Full-month task
    {
      name: 'System Maintenance',
      start: moment('2024-01-10'),
      end: moment('2024-02-09'),
      status: 'completed',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Multiple overlaps complex
    {
      name: 'User Testing',
      start: moment('2024-01-03'),
      end: moment('2024-01-08'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    {
      name: 'Bug Fixing',
      start: moment('2024-01-06'),
      end: moment('2024-01-12'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Edge case tasks
    {
      name: 'New Year Launch',
      start: moment('2023-12-31'),
      end: moment('2024-01-02'),
      status: 'completed',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    {
      name: 'Q1 Planning',
      start: moment('2024-01-28'),
      end: moment('2024-02-05'),
      status: 'notStarted',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Non-overlapping task
    {
      name: 'Documentation',
      start: moment('2024-01-20'),
      end: moment('2024-01-25'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Multi-month span
    {
      name: 'Infrastructure Upgrade',
      start: moment('2023-11-01'),
      end: moment('2024-01-15'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    // Dense cluster
    {
      name: 'A/B Testing',
      start: moment('2024-01-07'),
      end: moment('2024-01-12'),
      status: 'completed',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    {
      name: 'Performance Tuning',
      start: moment('2024-01-07'),
      end: moment('2024-01-11'),
      status: 'inProcess',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
    {
      name: 'Hotfix Deployment',
      start: moment('2024-01-09'),
      end: moment('2024-01-10'),
      status: 'notStarted',
      profileUrls: ['https://placehold.co/400', 'https://placehold.co/400'],
    },
  ];

  ngOnInit() {
    this.updateChart();
  }

  updateChart() {
    const firstDay = moment([this.selectedYear, this.selectedMonth]);
    const lastDay = moment(firstDay).endOf('month');

    this.days = Array.from({ length: firstDay.daysInMonth() }, (_, i) => {
      const date = moment(firstDay).date(i + 1);
      return {
        dayNumber: i + 1,
        dayName: date.format('dd'),
      };
    });

    // Get tasks that overlap with selected month
    this.filteredTasks = this.tasks.filter(
      (task) => task.start.isSameOrBefore(lastDay) && task.end.isSameOrAfter(firstDay),
    );

    // Calculate vertical positions
    this.calculateTaskPositions();
  }

  private calculateTaskPositions() {
    const taskLanes: Task[][] = []; // Array of task lanes (rows)

    this.filteredTasks.forEach((task) => {
      const taskStart = task.start.clone().startOf('day');
      const taskEnd = task.end.clone().endOf('day');

      let placed = false;
      for (const lane of taskLanes) {
        // Check for overlap
        if (!lane.some((t) => !(t.end.isBefore(taskStart) || t.start.isAfter(taskEnd)))) {
          lane.push(task); // Place in available row (lane)
          placed = true;
          break;
        }
      }

      if (!placed) {
        taskLanes.push([task]); // Create a new lane if no space available
      }
    });

    // Assign vertical positions dynamically
    taskLanes.forEach((lane, index) => {
      lane.forEach((task) => {
        (task as any)['top'] = index * this.rowHeight; // Proper row spacing
      });
    });

    // Dynamically set the height of the tasks-container
    this.tasksContainerHeight = `${taskLanes.length * this.rowHeight}px`;
  }

  getTaskPosition(task: any) {
    const firstDay = moment([this.selectedYear, this.selectedMonth]); // Start of the month
    const lastDay = moment(firstDay).endOf('month'); // End of the month

    const dayWidth = 45; // Set each day width to 45px

    // Handle tasks that start before the selected month
    const startDate = task.start.isBefore(firstDay) ? 1 : task.start.date();
    // Handle tasks that end after the selected month
    const endDate = task.end.isAfter(lastDay) ? lastDay.date() : task.end.date();

    const duration = endDate - startDate + 1;

    return {
      left: `${(startDate - 1) * dayWidth}px`, // Correct left positioning
      width: `${duration * dayWidth}px`, // Adjust width for tasks
      top: `${task['top']}px`, // Prevent overlapping
    };
  }

  get visibleMonths(): string[] {
    // Ensure selectedMonth is always in the middle when possible
    if (this.selectedMonth === 0) {
      return this.months.slice(0, 3); // First three months
    } else if (this.selectedMonth === 11) {
      return this.months.slice(9, 12); // Last three months
    } else {
      return this.months.slice(this.selectedMonth - 1, this.selectedMonth + 2);
    }
  }

  getDisplayedMonths(): number[] {
    if (this.selectedMonth === 0) {
      return [0, 1, 2]; // Jan, Feb, Mar
    } else if (this.selectedMonth === 11) {
      return [9, 10, 11]; // Oct, Nov, Dec
    } else {
      return [this.selectedMonth - 1, this.selectedMonth, this.selectedMonth + 1];
    }
  }

  prevMonth() {
    if (this.selectedMonth > 0) {
      this.selectedMonth--;
    } else if (this.selectedYear > this.years[0]) {
      this.selectedMonth = 11;
      this.selectedYear--;
    }
    this.updateChart();
  }

  nextMonth() {
    if (this.selectedMonth < 11) {
      this.selectedMonth++;
    } else if (this.selectedYear < this.years[this.years.length - 1]) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this.updateChart();
  }

  selectMonth(index: number) {
    this.selectedMonth = index;
    this.updateChart();
  }

  onTaskClick(task: any) {
    console.log('Selected task', task);
  }
}
