-- Adicionar coluna avatar_url na tabela profiles se não existir
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(avatar_url) WHERE avatar_url IS NOT NULL;

-- Comentário
COMMENT ON COLUMN profiles.avatar_url IS 'URL pública da foto de perfil do usuário armazenada no Supabase Storage';
