-- 我们的花园 V2.0 Supabase 数据库迁移脚本
-- 在 Supabase Dashboard > SQL Editor 中执行此文件

-- 1. 打卡记录表
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  items JSONB NOT NULL DEFAULT '[]',
  daily_score INTEGER DEFAULT 0,
  redline_clear BOOLEAN DEFAULT false,
  starter_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(author, date)
);

-- 2. 积分流水表
CREATE TABLE IF NOT EXISTS score_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance INTEGER NOT NULL,
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 照片元数据表
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type TEXT DEFAULT 'image',
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  tags TEXT[] DEFAULT '{}',
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 纪念日表
CREATE TABLE IF NOT EXISTS anniversaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  remind_before INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 经期记录表
CREATE TABLE IF NOT EXISTS period_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 爱爱记录表
CREATE TABLE IF NOT EXISTS intimacy_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL,
  rating INTEGER NOT NULL,
  note TEXT DEFAULT '',
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. 互动记录表
CREATE TABLE IF NOT EXISTS interaction_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  question TEXT,
  answer TEXT,
  extra JSONB DEFAULT '{}',
  rating INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 启动句库
CREATE TABLE IF NOT EXISTS phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  scenario TEXT NOT NULL,
  text TEXT NOT NULL,
  used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. 心愿池
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 承诺墙
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. 补偿小卖部
CREATE TABLE IF NOT EXISTS compensations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  violator TEXT NOT NULL,
  violation TEXT NOT NULL,
  level TEXT NOT NULL,
  compensation TEXT NOT NULL,
  compensation_done BOOLEAN DEFAULT false,
  acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. 成长记录
CREATE TABLE IF NOT EXISTS growth_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  person TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 Realtime（实时推送）
ALTER PUBLICATION supabase_realtime ADD TABLE checkins;
ALTER PUBLICATION supabase_realtime ADD TABLE score_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE photos;
ALTER PUBLICATION supabase_realtime ADD TABLE anniversaries;
ALTER PUBLICATION supabase_realtime ADD TABLE period_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE intimacy_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE interaction_history;
ALTER PUBLICATION supabase_realtime ADD TABLE phrases;
ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
ALTER PUBLICATION supabase_realtime ADD TABLE commitments;
ALTER PUBLICATION supabase_realtime ADD TABLE compensations;
ALTER PUBLICATION supabase_realtime ADD TABLE growth_records;

-- 13. 见面日程表
CREATE TABLE IF NOT EXISTS meeting_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  next_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. 周红线守护
CREATE TABLE IF NOT EXISTS weekly_redlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  week_start DATE NOT NULL,
  cleared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(author, week_start)
);

-- 15. 矛盾复盘表
CREATE TABLE IF NOT EXISTS conflict_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  record_date DATE NOT NULL,
  trigger_content TEXT NOT NULL DEFAULT '',
  need_content TEXT NOT NULL DEFAULT '',
  loved_content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE meeting_schedule;
ALTER PUBLICATION supabase_realtime ADD TABLE weekly_redlines;
ALTER PUBLICATION supabase_realtime ADD TABLE conflict_reviews;

-- 创建 Storage Bucket（照片存储）
-- 请在 Supabase Dashboard > Storage 中手动创建名为 "photos" 的公开 Bucket
-- 或者执行：
-- INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);
-- CREATE POLICY "Public read photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
-- CREATE POLICY "Anyone insert photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'photos');
