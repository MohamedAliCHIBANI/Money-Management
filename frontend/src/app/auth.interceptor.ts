import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = '';

  // Vérifie que l'on est côté navigateur
  if (typeof window !== 'undefined') {
    token = sessionStorage.getItem('authToken') || '';
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};