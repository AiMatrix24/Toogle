export function createTables(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      role TEXT NOT NULL CHECK(role IN ('customer','provider','admin')),
      avatar_url TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
      business_name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      hourly_rate REAL,
      phone TEXT,
      available INTEGER DEFAULT 0,
      response_time TEXT DEFAULT '< 1 hr',
      lat REAL,
      lng REAL,
      address TEXT,
      service_radius REAL DEFAULT 25.0,
      distance REAL DEFAULT 0,
      favorite_count INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_services (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      name TEXT NOT NULL,
      description TEXT,
      price REAL,
      price_type TEXT DEFAULT 'hourly' CHECK(price_type IN ('hourly','flat','package','minimum')),
      duration_minutes INTEGER,
      includes TEXT,
      UNIQUE(provider_id, name)
    );

    CREATE TABLE IF NOT EXISTS provider_hours (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      day_of_week INTEGER NOT NULL,
      open_time TEXT,
      close_time TEXT,
      is_closed INTEGER DEFAULT 0,
      UNIQUE(provider_id, day_of_week)
    );

    CREATE TABLE IF NOT EXISTS provider_portfolio (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      title TEXT,
      description TEXT,
      service TEXT,
      date TEXT,
      before_label TEXT,
      after_label TEXT,
      before_color TEXT,
      after_color TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_blog (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      title TEXT NOT NULL,
      content TEXT,
      excerpt TEXT,
      published INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_media (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      type TEXT CHECK(type IN ('video','podcast','audio','image')),
      title TEXT,
      url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS provider_reviews (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      user_name TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      text TEXT,
      date TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id TEXT NOT NULL REFERENCES users(id),
      provider_id TEXT NOT NULL REFERENCES providers(id),
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, provider_id)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES users(id),
      provider_id TEXT NOT NULL REFERENCES providers(id),
      service_id TEXT REFERENCES provider_services(id),
      service_name TEXT NOT NULL,
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','confirmed','en-route','arriving-soon','arrived','in-progress','completed','cancelled','no-show')),
      notes TEXT,
      total_amount REAL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS availability_slots (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      is_available INTEGER DEFAULT 1,
      UNIQUE(provider_id, date, start_time)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL REFERENCES users(id),
      provider_id TEXT NOT NULL REFERENCES providers(id),
      last_message_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(customer_id, provider_id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      sender_id TEXT NOT NULL REFERENCES users(id),
      text TEXT NOT NULL,
      status TEXT DEFAULT 'sent' CHECK(status IN ('sent','delivered','read')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT,
      data TEXT,
      read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      booking_id TEXT REFERENCES bookings(id),
      customer_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      amount REAL NOT NULL,
      subtotal REAL,
      service_fee REAL,
      tax REAL,
      payment_method TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','processing','completed','refunded','failed')),
      transaction_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      title TEXT,
      description TEXT,
      original_price REAL,
      deal_price REAL,
      percent_off INTEGER,
      category TEXT,
      max_claims INTEGER,
      claimed_count INTEGER DEFAULT 0,
      expires_at TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS deal_claims (
      id TEXT PRIMARY KEY,
      deal_id TEXT NOT NULL REFERENCES deals(id),
      user_id TEXT NOT NULL REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(deal_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      booking_id TEXT REFERENCES bookings(id),
      customer_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      text TEXT,
      tags TEXT,
      provider_response TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rewards (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      action TEXT NOT NULL,
      points INTEGER NOT NULL,
      type TEXT CHECK(type IN ('earn','redeem')),
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL REFERENCES users(id),
      referred_id TEXT,
      code TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      reward_amount REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reported_user_id TEXT,
      reported_provider_id TEXT,
      reason TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS saved_searches (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      query TEXT,
      category TEXT,
      filters TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS renewal_reminders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      service_name TEXT NOT NULL,
      provider_name TEXT,
      provider_id TEXT,
      last_service_date TEXT,
      reminder_date TEXT NOT NULL,
      frequency_days INTEGER DEFAULT 365,
      status TEXT DEFAULT 'active' CHECK(status IN ('active','snoozed','completed','cancelled')),
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notification_preferences (
      user_id TEXT PRIMARY KEY REFERENCES users(id),
      email_notifications INTEGER DEFAULT 1,
      sms_notifications INTEGER DEFAULT 1,
      push_notifications INTEGER DEFAULT 1,
      marketing_emails INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      subject TEXT NOT NULL,
      type TEXT DEFAULT 'general',
      description TEXT,
      status TEXT DEFAULT 'open' CHECK(status IN ('open','in-progress','resolved','closed')),
      priority TEXT DEFAULT 'normal',
      reference_id TEXT,
      admin_notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS payouts (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL REFERENCES providers(id),
      amount REAL NOT NULL,
      status TEXT DEFAULT 'processing' CHECK(status IN ('processing','paid','failed')),
      method TEXT DEFAULT 'samiteon',
      created_at TEXT DEFAULT (datetime('now')),
      paid_at TEXT
    );
  `);
}
