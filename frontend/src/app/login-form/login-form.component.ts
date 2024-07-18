import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NameErrorStateMatcher } from "../core/name-error-state";
import { Router } from "@angular/router";
import { AuthService } from "../core/auth/auth.service";
import { BlockUIService } from "../core/services/block-ui.service";

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.less'],
    providers: [
        BlockUIService,
    ]
})

export class LoginFormComponent implements OnInit {
    public blockUI = false;
    errorMessage: string = '';
    form: FormGroup = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    matcher = new NameErrorStateMatcher();

    constructor(private router:Router, private authService: AuthService) {
        const date = new Date();
        console.log(date.toString());
    }

    ngOnInit(): void {
        // this.blockUIService.blockUIEvent.subscribe((event: boolean) => this.blockUI = event);
    }

    // submit() {
    //     if (this.form.valid) {
    //         this.authService.login(this.form.value);
    //     }
    // }

    submit() {
        if (this.form.valid) {
            this.authService.login(this.form.value)?.subscribe({
                next: (response) => {
                    if (response) {
                        this.authService.setSession(response);
                        this.authService.loggedIn.next(true);
                        this.router.navigate(['/']);
                    } else {
                        this.errorMessage = "Sai tài khoản hoặc mật khẩu";
                    }
                },
                error: (err) => { 
                    console.log(err);
                    this.errorMessage = err.message;
                }});
        }
    }
}