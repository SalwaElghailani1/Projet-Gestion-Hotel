// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('🔄 [Interceptor] Intercepting request to:', req.url);
    
    // قائمة المسارات العامة التي لا تحتاج توكن
    const publicRoutes = [
      '/login',
      '/register',
      '/v1/users/login',
      '/v1/users/register'
    ];
    
    // التحقق إذا كان الطلب لمسار عام
    const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
    
    if (isPublicRoute) {
      console.log('🌐 [Interceptor] Public route, skipping token');
      return next.handle(req);
    }
    
    // الحصول على التوكن
    const token = this.authService.getToken();
    
    if (token) {
      console.log('✅ [Interceptor] Adding token to request');
      console.log('🔑 Token preview:', token.substring(0, 30) + '...');
      
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    } else {
      console.warn('⚠️ [Interceptor] No token available for protected route');
      
      // إذا كان الطلب محميًا ولا يوجد توكن، توجيه للـ login
      if (!isPublicRoute) {
        console.log('🔒 [Interceptor] Redirecting to login...');
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: this.router.url }
        });
      }
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ [Interceptor] HTTP Error:', {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message
    });
    
    if (error.status === 401) {
      console.warn('🔒 [Interceptor] Unauthorized (401)');
      
      // Token expired or invalid
      this.authService.logout();
      
      // التوجيه إلى صفحة تسجيل الدخول
      this.router.navigate(['/login'], {
        queryParams: { 
          returnUrl: this.router.url,
          sessionExpired: true 
        }
      });
      
      // إظهار رسالة للمستخدم
      // يمكنك إضافة snackbar هنا إذا أردت
    } else if (error.status === 403) {
      console.warn('⛔ [Interceptor] Forbidden (403)');
      // توجيه إلى صفحة غير مصرح بها
      this.router.navigate(['/unauthorized']);
    }
    
    return throwError(() => error);
  }
}