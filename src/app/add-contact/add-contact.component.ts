import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit {
  contactForm: FormGroup;
  latitude: number | null = null;
  longitude: number | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      addresses: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  get addressArray() {
    return this.contactForm.get('addresses') as FormArray;
  }

  addAddress() {
    if (this.addressArray.length < 5) {
      this.addressArray.push(this.fb.control('', Validators.required));
    }
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const contact = {
        ...this.contactForm.value,
        latitude: this.latitude,
        longitude: this.longitude
      };

      // Save contact to localStorage
      localStorage.setItem('name', contact.name);
      localStorage.setItem('phoneNumber', contact.phone);
      localStorage.setItem('email', contact.email);
      localStorage.setItem('latitude', contact.latitude.toString());
      localStorage.setItem('longitude', contact.longitude.toString());
      localStorage.setItem('addresses', JSON.stringify(contact.addresses));

      // Navigate back to dashboard
      this.router.navigate(['/']);
    } else {
      // Mark all controls as touched to trigger validation messages
      this.contactForm.markAllAsTouched();
    }
  }
}
