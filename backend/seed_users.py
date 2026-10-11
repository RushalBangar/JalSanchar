"""
Alias entrypoint for seeding Supabase users.
Delegates to seed_supabase_users.py.
"""

import sys
import os

# Delegate to seed_supabase_users
script_path = os.path.join(os.path.dirname(__file__), "seed_supabase_users.py")
if os.path.exists(script_path):
    with open(script_path, "r", encoding="utf-8") as f:
        code = f.read()
    exec(compile(code, script_path, "exec"), globals())
else:
    print("[Error] seed_supabase_users.py not found.")
