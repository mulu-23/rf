const DB = {
  KEY: 'konferencii_rf_db',

  init() {
    if (!localStorage.getItem(this.KEY)) {
      const initial = {
        users: [
          {
            id: 1,
            login: 'Conf2027',
            password: 'Demo77',
            full_name: 'Администратор',
            phone: '+7 (000) 000-00-00',
            email: 'admin@конференции.рф',
            role: 'admin'
          }
        ],
        rooms: [
          {
            id: 1,
            name: 'Аудитория «Президиум»',
            type: 'Аудитория',
            capacity: 120,
            description: 'Просторный зал с трибуной, проектором и системой звукоусиления. Идеален для пленарных заседаний.',
            equipment: 'Проектор, микрофоны, трибуна, кондиционер',
            price: 25000,
            image: 'images/auditorium.jpg'
          },
          {
            id: 2,
            name: 'Коворкинг «Синергия»',
            type: 'Коворкинг',
            capacity: 40,
            description: 'Гибкое пространство для командной работы, воркшопов и мозговых штурмов.',
            equipment: 'Маркерная доска, флипчарт, Wi-Fi, кофе-поинт',
            price: 12000,
            image: 'images/coworking.jpg'
          },
          {
            id: 3,
            name: 'Кинозал «Премьера»',
            type: 'Кинозал',
            capacity: 80,
            description: 'Зал с большим экраном и объёмным звуком для презентаций и показов.',
            equipment: 'Экран 5м, Dolby Atmos, кресла-реклайнеры',
            price: 18000,
            image: 'images/cinema.jpg'
          }
        ],
        applications: [],
        reviews: [],
        nextUserId: 2,
        nextApplicationId: 1,
        nextReviewId: 1
      };
      localStorage.setItem(this.KEY, JSON.stringify(initial));
    }
  },

  read() {
    return JSON.parse(localStorage.getItem(this.KEY));
  },

  write(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  getUsers() { return this.read().users; },

  findUserByLogin(login) {
    return this.read().users.find(u => u.login === login);
  },

  findUserById(id) {
    return this.read().users.find(u => u.id === id);
  },

  addUser(user) {
    const db = this.read();
    user.id = db.nextUserId++;
    user.role = 'user';
    db.users.push(user);
    this.write(db);
    return user;
  },

  getRooms() { return this.read().rooms; },

  findRoomById(id) {
    return this.read().rooms.find(r => r.id === id);
  },

  getApplications() { return this.read().applications; },

  getUserApplications(userId) {
    return this.read().applications.filter(a => a.user_id === userId);
  },

  addApplication(app) {
    const db = this.read();
    app.id = db.nextApplicationId++;
    app.status = 'Новая';
    app.created_at = new Date().toISOString();
    db.applications.push(app);
    this.write(db);
    return app;
  },

  updateApplicationStatus(id, status) {
    const db = this.read();
    const app = db.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      this.write(db);
    }
    return app;
  },

  getReviews() { return this.read().reviews; },

  getReviewByApplication(appId) {
    return this.read().reviews.find(r => r.application_id === appId);
  },

  addReview(review) {
    const db = this.read();
    review.id = db.nextReviewId++;
    review.created_at = new Date().toISOString();
    db.reviews.push(review);
    this.write(db);
    return review;
  },

  setCurrentUser(user) {
    localStorage.setItem('konferencii_current_user', JSON.stringify(user));
  },

  getCurrentUser() {
    const raw = localStorage.getItem('konferencii_current_user');
    return raw ? JSON.parse(raw) : null;
  },

  logout() {
    localStorage.removeItem('konferencii_current_user');
  },

  isAdmin() {
    const u = this.getCurrentUser();
    return u && u.role === 'admin';
  }
};

DB.init();

export default DB;