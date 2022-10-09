import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase/compat/app';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  authState!: Observable<firebase.User | null>;
  registerForm: any;
  loginForm: any;
  isLogin = false;

  constructor(private authService: AuthService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.authState = this.authService.getAuthState();
    this.initializeForm();
  }

  googleSignIn() {
    this.authService.googleSignIn();
  }

  signInEmailAndPassword(email: string, password: string) {
    this.authService.registerInWithEmailAndPassword(email, password);
  }

  signOut() {
    this.authService.signOut();
  }

  private initializeForm() {
    this.registerForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });
    this.registerForm.controls.password.valueChanges.subscribe({
      next: (_form: any) => {
        this.registerForm.controls.confirmPassword.updateValueAndValidity();
      }
    })
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value ? null : { isMatching: true }
    }
  }
}
