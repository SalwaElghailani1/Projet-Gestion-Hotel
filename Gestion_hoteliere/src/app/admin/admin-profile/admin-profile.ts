import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule   // ✅ ضروري
  ],
  templateUrl: './admin-profile.html',
  styleUrls: ['./admin-profile.css']
})
export class AdminProfileComponent implements OnInit {

  profileForm!: FormGroup;

  // user المستعمل فـ HTML
  user = {
    nom: 'admin',
    prenom: 'admin'
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  // إنشاء الفورم
  private initForm(): void {
    this.profileForm = this.fb.group({
      nom: [{ value: '', disabled: true }, Validators.required],
      prenom: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      tel: ['', Validators.required],
      dateNaissance: [''],
      cne: ['']
    });
  }

  // تحميل بيانات المستخدم
  private loadUserData(): void {
    const userData = {
      nom: 'admin',
      prenom: 'admin',
      email: 'admin@example.com',
      tel: '0612345678',
      dateNaissance: '1999-01-01',
      cne: 'AB123456'
    };

    this.profileForm.patchValue(userData);
  }

  // submit
  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    // getRawValue باش نجيب حتى الحقول disabled
    const updatedProfile = this.profileForm.getRawValue();

    console.log('Profil mis à jour :', updatedProfile);

    // هنا دير appel API (HTTP PUT / PATCH)
  }

  // annuler
  cancelEdit(): void {
    this.loadUserData();
    this.profileForm.markAsPristine();
  }
}
