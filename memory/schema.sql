-- Oh My Orq Memory System (Project Cortex) Schema
-- SQLite database for persistent project memory and token tracking

-- ========================================
-- MEMORY STORAGE
-- ========================================

CREATE TABLE IF NOT EXISTS memories (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN (
    'decision', 'architecture', 'pattern', 'dependency',
    'bug', 'preference', 'convention', 'lesson'
  )),
  content TEXT NOT NULL,
  tags TEXT DEFAULT '[]',           -- JSON array of tags
  relevance_score REAL DEFAULT 1.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER DEFAULT 0,
  source_agent TEXT,                -- Which agent created this memory
  session_id TEXT                   -- Which session created this memory
);

CREATE INDEX IF NOT EXISTS idx_memories_project ON memories(project_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
CREATE INDEX IF NOT EXISTS idx_memories_relevance ON memories(relevance_score DESC);

-- ========================================
-- TOKEN USAGE TRACKING
-- ========================================

CREATE TABLE IF NOT EXISTS token_usage (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK(provider IN ('openai', 'anthropic', 'google', 'other')),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  cost_usd REAL DEFAULT 0.0,
  task_type TEXT,
  task_description TEXT,
  cached_tokens INTEGER DEFAULT 0,  -- Tokens served from cache
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  project_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_token_usage_session ON token_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_model ON token_usage(model_name);
CREATE INDEX IF NOT EXISTS idx_token_usage_agent ON token_usage(agent_name);
CREATE INDEX IF NOT EXISTS idx_token_usage_timestamp ON token_usage(timestamp);

-- ========================================
-- SESSION TRACKING
-- ========================================

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'failed', 'cancelled')),
  task_description TEXT,
  agents_used TEXT DEFAULT '[]',    -- JSON array of agent names
  total_tokens INTEGER DEFAULT 0,
  total_cost REAL DEFAULT 0.0
);

CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- ========================================
-- PROMPT CACHE
-- ========================================

CREATE TABLE IF NOT EXISTS prompt_cache (
  hash TEXT PRIMARY KEY,
  prompt_prefix TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  size_tokens INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prompt_cache_agent ON prompt_cache(agent_name);
CREATE INDEX IF NOT EXISTS idx_prompt_cache_hits ON prompt_cache(hit_count DESC);
