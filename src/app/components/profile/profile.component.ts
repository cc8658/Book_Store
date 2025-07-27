import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { UserService } from '../../services/user/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  personal!: FormGroup;
  addressForm!: FormGroup;

  isEditing = false;
  isEditingAdd = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const address = (userInfo.address && userInfo.address[0]) || {
      type: 'Home',
      address: '',
      city: '',
      state: '',
    };

    this.personal = new FormGroup({
      fullName: new FormControl({
        value: userInfo.fullName || '',
        disabled: true,
      }),
      email: new FormControl({ value: userInfo.email || '', disabled: true }),
      password: new FormControl({ value: '***********', disabled: true }),
      phone: new FormControl({ value: userInfo.phone || '', disabled: true }),
    });

    this.addressForm = new FormGroup({
      type: new FormControl({ value: address.type || 'Home', disabled: true }),
      address: new FormControl({ value: address.address, disabled: true }),
      city: new FormControl({ value: address.city, disabled: true }),
      state: new FormControl({ value: address.state, disabled: true }),
    });
  }

  enableEdit(): void {
    this.isEditing = true;
    Object.values(this.personal.controls).forEach((control) =>
      (control as FormControl).enable()
    );
  }

  save(): void {
    this.isEditing = false;
    Object.values(this.personal.controls).forEach((control) =>
      (control as FormControl).disable()
    );
  }

  enableAddEdit(): void {
    this.isEditingAdd = true;
    Object.values(this.addressForm.controls).forEach((control) =>
      (control as FormControl).enable()
    );
  }

  saveAddress(): void {
    const payload = {
      addressType: this.addressForm.get('type')?.value,
      fullAddress: this.addressForm.get('address')?.value,
      city: this.addressForm.get('city')?.value,
      state: this.addressForm.get('state')?.value,
    };

    this.userService.putInfo(payload).subscribe({
      next: (res: any) => {
        console.log('User info updated:', res);
        this.isEditingAdd = false;

        let users = JSON.parse(localStorage.getItem('users') || '[]');
        let currentUser = JSON.parse(
          localStorage.getItem('currentUser') || '{}'
        );

        currentUser.address = [
          {
            type: payload.addressType,
            address: payload.fullAddress,
            city: payload.city,
            state: payload.state,
          },
        ];

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        users = users.map((user: any) =>
          user.email === currentUser.email ? currentUser : user
        );

        localStorage.setItem('users', JSON.stringify(users));

        Object.values(this.addressForm.controls).forEach((control) =>
          (control as FormControl).disable()
        );
      },
      error: (err) => {
        console.error('Failed to update address:', err);
      },
    });
  }

  addNewAddress(): void {
    alert('Add new address logic to be implemented');
  }
}
