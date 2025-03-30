import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload & { exp: number }>(token);
      if (decoded.exp) {
        // Check if token is expired
        return decoded.exp < Date.now() / 1000;
      }
      return true;
    } catch (err) {
      return true;
    }
  }

  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  login(idToken: string) {
    // Save token to localStorage
    localStorage.setItem('id_token', idToken);
    // Redirect to home page
    window.location.assign('/');
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    // Redirect to login page
    window.location.assign('/login');
  }
}

export default new AuthService();
