# 📋 Complete Feature Inventory - IWM Application

**Date**: 2025-01-15  
**Purpose**: Comprehensive list of ALL features for toggle system  
**Status**: ✅ COMPLETE

---

## 🎯 Feature Categories

### **Category 1: Core Navigation** (4 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `home` | Home | `/` | Active | `true` |
| `explore` | Explore | `/explore` | Active | `true` |
| `movies` | Movies | `/movies` | Active | `true` |
| `search` | Search | `/search` | Active | `true` |

### **Category 2: Content Features** (10 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `visual_treats` | Visual Treats | `/visual-treats` | Active | `false` |
| `cricket` | Cricket | `/cricket` | Active | `false` |
| `scene_explorer` | Scene Explorer | `/scene-explorer` | Active | `false` |
| `awards` | Awards | `/awards` | Active | `false` |
| `festivals` | Festivals | `/festivals` | Active | `false` |
| `box_office` | Box Office | `/box-office` | Active | `false` |
| `movie_calendar` | Movie Calendar | `/movie-calendar` | Hidden | `false` |
| `quiz_system` | Quiz System | `/quiz` | Hidden | `false` |
| `people` | People Directory | `/people` | Active | `true` |
| `tv_shows` | TV Shows | `/tv-shows` | Planned | `false` |

### **Category 3: Community Features** (3 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `pulse` | Pulse | `/pulse` | Active | `false` |
| `talent_hub` | Talent Hub | `/talent-hub` | Active | `false` |
| `industry_hub` | Industry Hub | `/industry` | Active | `false` |

### **Category 4: Personal Features** (5 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `profile` | My Profile | `/profile` | Active | `true` |
| `watchlist` | Watchlist | `/watchlist` | Active | `true` |
| `favorites` | Favorites | `/favorites` | Active | `true` |
| `collections` | Collections | `/collections` | Active | `true` |
| `notifications` | Notifications | `/notifications` | Active | `true` |

### **Category 5: Critic Features** (4 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `critics_directory` | Critics Directory | `/critics` | Active | `false` |
| `critic_applications` | Apply as Critic | `/apply-critic` | Hidden | `false` |
| `critic_dashboard` | Critic Dashboard | `/critic/dashboard` | Hidden | `false` |
| `critic_profile` | Critic Profile | `/critic/[username]` | Active | `false` |

### **Category 6: Discovery Features** (4 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `compare_movies` | Compare Movies | `/compare` | Hidden | `false` |
| `recent_views` | Recent Views | `/recent` | Hidden | `false` |
| `search_demo` | Search Demo | `/search-demo` | Hidden | `false` |
| `dashboard` | User Dashboard | `/dashboard` | Hidden | `false` |

### **Category 7: Settings Features** (10 features)
| Feature Key | Feature Name | Location | Current Status | Default State |
|-------------|--------------|----------|----------------|---------------|
| `settings_profile` | Profile Settings | Settings → Profile | Active | `true` |
| `settings_account` | Account Settings | Settings → Account | Active | `true` |
| `settings_privacy` | Privacy Settings | Settings → Privacy | Active | `true` |
| `settings_display` | Display Settings | Settings → Display | Active | `true` |
| `settings_preferences` | Preferences | Settings → Preferences | Active | `true` |
| `settings_notifications` | Notification Preferences | Settings → Notifications | Active | `true` |
| `settings_roles` | Roles Management | Settings → Roles | Active | `false` |
| `settings_critic` | Critic Settings | Settings → Critic | Active | `false` |
| `settings_talent` | Talent Settings | Settings → Talent | Active | `false` |
| `settings_industry` | Industry Settings | Settings → Industry | Active | `false` |

### **Category 8: Support Features** (2 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `help_center` | Help Center | `/help` | Active | `true` |
| `landing_page` | Landing Page | `/landing` | Hidden | `false` |

### **Category 9: Review Features** (2 features)
| Feature Key | Feature Name | Route | Current Status | Default State |
|-------------|--------------|-------|----------------|---------------|
| `reviews` | Reviews | `/reviews` | Active | `true` |
| `movie_reviews` | Movie Reviews | `/movies/[id]/reviews` | Active | `true` |

---

## 📊 Summary Statistics

| Category | Total Features | Active | Hidden | Planned | Default Enabled |
|----------|----------------|--------|--------|---------|-----------------|
| Core Navigation | 4 | 4 | 0 | 0 | 4 |
| Content Features | 10 | 6 | 3 | 1 | 2 |
| Community Features | 3 | 3 | 0 | 0 | 0 |
| Personal Features | 5 | 5 | 0 | 0 | 5 |
| Critic Features | 4 | 2 | 2 | 0 | 0 |
| Discovery Features | 4 | 0 | 4 | 0 | 0 |
| Settings Features | 10 | 10 | 0 | 0 | 6 |
| Support Features | 2 | 1 | 1 | 0 | 1 |
| Review Features | 2 | 2 | 0 | 0 | 2 |
| **TOTAL** | **44** | **33** | **10** | **1** | **20** |

---

## 🔑 Feature Key Naming Convention

- **Format**: `lowercase_with_underscores`
- **Examples**: `visual_treats`, `critic_dashboard`, `settings_roles`
- **Consistency**: All keys follow this pattern for database and API usage

---

## 📝 Notes

1. **Default States**: Features set to `true` by default are considered essential for MVP
2. **Hidden Features**: Exist in codebase but not currently in navigation
3. **Planned Features**: Mentioned in code/docs but not fully implemented
4. **Settings Features**: All settings tabs are toggleable, including role-specific ones

---

**Total Toggleable Features**: 44

