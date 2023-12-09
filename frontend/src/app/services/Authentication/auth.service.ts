import {Injectable} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth'
import {LoginData} from './LoginData';
import {RegisterData} from './RegisterData';
import {ReflectionSplashScreenService} from '../splash-screen';
import {doc, DocumentReference, Firestore, getDoc, onSnapshot, serverTimestamp, setDoc} from '@angular/fire/firestore';
import {ReflectionUser} from "../../interfaces";
import {DocumentSnapshot} from "@firebase/firestore";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {CartService} from "../Cart/cart.service";
import {map} from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _stateSource: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>({
    user: null,
  });
  state$ = this._stateSource.asObservable();
  userDoc: DocumentReference;


  constructor(private auth: Auth,
              private readonly splashService: ReflectionSplashScreenService,
              private readonly firestore: Firestore,
              private router: Router,
              private cartService: CartService,
  ) {
    this.listenToAuthStateChanges();
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.state$.pipe(
      map(state => !!state.user)
    );
  }

  get isUserVerified(): boolean {

    return !!this._getCurrentState.user && (this.auth.currentUser?.emailVerified || false);
  }

  private get _getCurrentState(): AuthState {
    return this._stateSource.value;
  }


  listenToAuthStateChanges(): void {
    this.auth.onAuthStateChanged(async (value) => {
      if (value != null && AuthService._getUserFromSession == null) {
        const user = this.userFromDocument((await this.getUserDataFromFirestore()));
        this._stateSource.next({
          user: user,
        });
        AuthService._setUserSession = user;
        if (!this.isUserVerified) {
          await sendEmailVerification(this.auth.currentUser!);
        }
        this.cartService.initializeCartDetails(user.id);
        this.userDoc = doc(this.firestore, `users/${user.id}`);
        this.listenToUserDocChanges();
      } else if (value != null && AuthService._getUserFromSession != null) {
        this._stateSource.next({
          user: AuthService._getUserFromSession,
        });
        this.userDoc = doc(this.firestore, `users/${AuthService._getUserFromSession.id}`);
        this.listenToUserDocChanges();
        this.cartService.initializeCartDetails(AuthService._getUserFromSession.id);
      } else {
        AuthService._clearUserSession();
      }
      this.splashService.hide();
    })
  }

  private static get _getUserFromSession(): ReflectionUser | null {
    const sessionUser = sessionStorage.getItem('user');
    return sessionUser ? JSON.parse(sessionUser) : null;
  }

  private static set _setUserSession(user: ReflectionUser) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private static _clearUserSession() {
    sessionStorage.removeItem('user');
  }

  // function to check isUserAdmin as observable
  get isUserAdmin(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.user ? state.user.type === 'admin' : false)
    );
  }

  get isNormalUser(): Observable<boolean> {
    return this.state$.pipe(
      map(state => state.user ? state.user.type === 'user' : false)
    );
  }


  async login(loginData: LoginData) {
    let userCredentials = await signInWithEmailAndPassword(this.auth, loginData.email, loginData.password);
    this.userDoc = doc(this.firestore, `users/${userCredentials.user.uid}`);
    this.userFromDocument(await getDoc(this.userDoc));
    this.listenToUserDocChanges();
  }


  async register(registerData: RegisterData): Promise<Promise<any>> {
    let userCredentials = await createUserWithEmailAndPassword(this.auth, registerData.email, registerData.password);
    this.userDoc = doc(this.firestore, `users/${userCredentials.user.uid}`);
    this.listenToUserDocChanges();
    return setDoc(this.userDoc, {
      email: registerData.email,
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      userId: userCredentials.user.uid,
      type: 'user',
      createdAt: serverTimestamp(),
    });
  }

  listenToUserDocChanges() {
    onSnapshot(this.userDoc, (snapshot) => {
      if (snapshot.data() != undefined) {
        this._stateSource.next({
          user: this.userFromDocument(snapshot),
        });
        AuthService._setUserSession = this.userFromDocument(snapshot);
      } else {
        this._stateSource.next({
          user: null,
        });
        AuthService._clearUserSession();
      }
    })
  }

  getUserDataFromFirestore(): Promise<DocumentSnapshot> {
    this.userDoc = doc(this.firestore, `users/${this.auth.currentUser?.uid}`);
    return getDoc(this.userDoc);
  }

  userFromDocument(doc: DocumentSnapshot): ReflectionUser {
    return {
      email: doc.data()!['email'],
      firstName: doc.data()!['firstName'],
      lastName: doc.data()!['lastName'],
      id: doc.id,
      type: doc.data()!['type'],
      createdAt: doc.data()!['createdAt'],
      zip: doc.data()!['zip'] || '',
      phone: doc.data()!['phone'] || '',
      address: doc.data()!['address'] || '',
      city: doc.data()!['city'] || '',
      state: doc.data()!['state'] || '',
    };
  }

  // Logout User
  logout() {
    this.auth.signOut();
    sessionStorage.removeItem('user');
    window.location.replace("/");
  }

  sendResetPasswordLink(email: string) {
    // check before that if the email is associated with a user
    // if not then return an error
    console.log(email);
    return sendPasswordResetEmail(this.auth, email);
  }

  async sendVerificationEmail(): Promise<any> {
    if(this.auth.currentUser && this.isEligibleForEmailVerification()) {
      await sendEmailVerification(this.auth.currentUser);
      this.addVerificationSendCountInSession();
    } else if(this.auth.currentUser && !this.isEligibleForEmailVerification()){
      console.log('You have already sent verification email');
      throw new Error('not eligible');
    } else {
      throw new Error('No user logged in');
    }
  }




  addVerificationSendCountInSession() {
    // get the current count from session if exit
    // then increment the count by 1 else set the count to 1
    // also set the session to expire in 5 minutes
    let count = sessionStorage.getItem('verificationSendCount');
    let newCount = count ? parseInt(count) + 1 : 1;
    sessionStorage.setItem('verificationSendCount', newCount.toString());
    // if count == 3 set the expiration time of 24 hours
    // else set the expiration time to 5 minutes
    let currentTime = new Date();
    let expirationTime = newCount == 3 ? currentTime.setHours(currentTime.getHours() + 24) : currentTime.setMinutes(currentTime.getMinutes() + 5);
    sessionStorage.setItem('verificationSendCountExpirationTime', expirationTime.toString());
  }

  isEligibleForEmailVerification(): boolean {
    if(this.auth.currentUser) {
      if(this.auth.currentUser.emailVerified) {
        return false;
      } else {
        let count = sessionStorage.getItem('verificationSendCount');
        let currentTime = new Date();
        let expirationTime = sessionStorage.getItem('verificationSendCountExpirationTime');
        if(count && expirationTime) {
          let count = parseInt(sessionStorage.getItem('verificationSendCount') as string);
          let expirationTime = parseInt(sessionStorage.getItem('verificationSendCountExpirationTime') as string);
          console.log(count, expirationTime);
          return currentTime.getTime() > expirationTime;
          // return count < 3 && currentTime.getTime() < expirationTime;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  }

  get emailVerificationEligibleTime(): Date {
    let expirationTime = parseInt(sessionStorage.getItem('verificationSendCountExpirationTime') as string);
    return new Date(expirationTime);
  }

  async checkCurrentUserIsAdminForAccess(): Promise<boolean> {
    if (this.auth.currentUser != null) {
      const data = await getDoc(this.userDoc);
      if (data.get("type") == "admin") {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }

  }

  async getCurrentUserType(): Promise<string> {
    let userData = await getDoc(this.userDoc);
    return userData.get("type");
  }

  get userId() {
    return this._stateSource.value.user?.id;
  }

  get user(){
    if(this._stateSource.value.user !== null) return this._stateSource.value.user;
    else if (AuthService._getUserFromSession !== null) return AuthService._getUserFromSession;
    else return null;
  }

}


export interface AuthState {
  user: ReflectionUser | null;
}
