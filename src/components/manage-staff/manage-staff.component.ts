import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-manage-staff',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manage-staff.component.html',
    styleUrls: ['./manage-staff.component.css']
})
export class ManageStaffComponent implements OnInit, OnDestroy {
    users: User[] = [];
    showModal = false;
    isEditMode = false;

    staffForm: Partial<User> & { password?: string } = {
        name: '',
        email: '',
        password: '',
        role: 'staff'
    };

    private subs = new Subscription();

    constructor(
        private userService: UserService,
        private toastService: ToastService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.subs.add(
            this.userService.getUsers().subscribe(users => {
                this.users = users;
            })
        );
        this.userService.fetchUsers().subscribe();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    openAddModal(): void {
        this.isEditMode = false;
        this.staffForm = {
            name: '',
            email: '',
            password: '',
            role: 'staff'
        };
        this.showModal = true;
    }

    openEditModal(user: User): void {
        this.isEditMode = true;
        this.staffForm = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            password: '' // Don't show password
        };
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
    }

    onSubmit(): void {
        if (!this.staffForm.name || !this.staffForm.email || (!this.isEditMode && !this.staffForm.password)) {
            this.toastService.warning('Please fill all required fields');
            return;
        }

        if (this.isEditMode && this.staffForm._id) {
            this.userService.updateUser(this.staffForm._id, this.staffForm).subscribe({
                next: () => {
                    this.closeModal();
                    this.toastService.success('Staff updated successfully');
                }
            });
        } else {
            this.userService.createUser(this.staffForm).subscribe({
                next: () => {
                    this.closeModal();
                    this.toastService.success('Staff created successfully');
                }
            });
        }
    }

    deleteUser(id: string): void {
        if (confirm('Are you sure you want to delete this staff member?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => this.toastService.success('Staff deleted successfully')
            });
        }
    }

    goBack(): void {
        this.router.navigate(['/dashboard']);
    }
}
