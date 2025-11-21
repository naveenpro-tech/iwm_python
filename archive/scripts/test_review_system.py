#!/usr/bin/env python3
"""Test review system end-to-end"""

import json
import urllib.request
import urllib.error

BASE_URL = "http://localhost:8000/api/v1"

def login():
    """Login and get access token"""
    print("🔐 Logging in...")
    
    data = json.dumps({
        "email": "user1@iwm.com",
        "password": "rmrnn0077"
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/auth/login",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            print("✅ Login successful!")
            return result['access_token']
    except Exception as e:
        print(f"❌ Login failed: {e}")
        return None

def create_review(access_token):
    """Create a test review"""
    print("\n📝 Creating review...")

    data = json.dumps({
        "movieId": "tt0111161",
        "userId": "user1@iwm.com",
        "rating": 9.5,
        "title": "A Masterpiece of Hope and Redemption",
        "content": "The Shawshank Redemption is an absolute masterpiece that transcends the prison drama genre. Tim Robbins and Morgan Freeman deliver career-defining performances that anchor this emotionally powerful story. The film's exploration of hope, friendship, and the human spirit is both profound and deeply moving. Frank Darabont's direction is impeccable, with every scene serving the narrative perfectly. The cinematography beautifully captures both the bleakness of prison life and the glimmers of hope that persist. The ending is one of the most satisfying in cinema history. This is a film that stays with you long after the credits roll.",
        "spoilers": False
    }).encode("utf-8")
    
    req = urllib.request.Request(
        f"{BASE_URL}/reviews",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            print("✅ Review created successfully!")
            print(f"   Review ID: {result.get('id', 'N/A')}")
            print(f"   Rating: {result.get('rating', 'N/A')}/10")
            return result.get('id')
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Review creation failed: {e.code}")
        print(f"   Error: {error_body}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def get_movie_reviews(movie_id):
    """Get reviews for a movie"""
    print(f"\n📖 Fetching reviews for movie {movie_id}...")
    
    req = urllib.request.Request(
        f"{BASE_URL}/reviews?movieId={movie_id}&limit=10",
        method="GET"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = resp.read().decode("utf-8")
            result = json.loads(body)
            
            if isinstance(result, list):
                print(f"✅ Found {len(result)} reviews")
                for i, review in enumerate(result, 1):
                    print(f"\n   Review {i}:")
                    print(f"   - Rating: {review.get('rating', 'N/A')}/10")
                    print(f"   - Title: {review.get('title', 'N/A')}")
                    print(f"   - Content: {review.get('content', '')[:100]}...")
                    print(f"   - Spoilers: {review.get('spoilers', False)}")
                return True
            else:
                print("❌ Unexpected response format")
                return False
    except Exception as e:
        print(f"❌ Error fetching reviews: {e}")
        return False

def create_multiple_reviews(access_token):
    """Create multiple test reviews"""
    print("\n📝 Creating multiple reviews...")
    
    reviews = [
        {
            "movieId": "tt0111161",
            "userId": "user1@iwm.com",
            "rating": 10.0,
            "title": "Perfect in Every Way",
            "content": "This is not just a movie, it's an experience. The Shawshank Redemption is a testament to the power of hope and the resilience of the human spirit. Every performance is pitch-perfect, every scene is meaningful, and the story is told with such care and attention to detail. The friendship between Andy and Red is one of the most genuine and touching relationships ever portrayed on screen. The cinematography is beautiful, the score is haunting, and the ending is absolutely perfect. This film deserves every bit of praise it receives.",
            "spoilers": False
        },
        {
            "movieId": "tt0111161",
            "userId": "user1@iwm.com",
            "rating": 8.5,
            "title": "Great Film, But Slightly Overrated",
            "content": "Don't get me wrong, The Shawshank Redemption is an excellent film with outstanding performances and a compelling story. However, I think it's slightly overrated as the #1 film of all time. The pacing can be slow at times, and some plot points feel a bit convenient. That said, the performances by Tim Robbins and Morgan Freeman are exceptional, and the themes of hope and redemption are beautifully explored. It's definitely worth watching, but I wouldn't call it the greatest film ever made.",
            "spoilers": False
        },
        {
            "movieId": "tt0111161",
            "userId": "user1@iwm.com",
            "rating": 9.0,
            "title": "A Timeless Classic with a Perfect Ending",
            "content": "SPOILER WARNING: The ending of this film is absolutely perfect. When Andy escapes through the tunnel and emerges in the rain, it's one of the most cathartic moments in cinema. The reveal that he's been planning his escape for years, using the rock hammer and the Rita Hayworth poster, is brilliant. And the final scene on the beach in Zihuatanejo with Red is the perfect conclusion to their story. This film is a masterclass in storytelling, and the ending elevates it to legendary status.",
            "spoilers": True
        }
    ]
    
    created_count = 0
    for i, review_data in enumerate(reviews, 1):
        print(f"\n   Creating review {i}/{len(reviews)}...")
        
        data = json.dumps(review_data).encode("utf-8")
        req = urllib.request.Request(
            f"{BASE_URL}/reviews",
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            },
            method="POST"
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                created_count += 1
                print(f"   ✅ Review {i} created")
        except Exception as e:
            print(f"   ❌ Review {i} failed: {e}")
    
    print(f"\n✅ Created {created_count}/{len(reviews)} reviews")
    return created_count > 0

def main():
    print("🧪 Testing Review System End-to-End\n")
    print("=" * 60)
    
    # Step 1: Login
    access_token = login()
    if not access_token:
        print("\n❌ Cannot proceed without authentication")
        return
    
    # Step 2: Create multiple reviews
    if not create_multiple_reviews(access_token):
        print("\n❌ Failed to create reviews")
        return
    
    # Step 3: Fetch reviews
    if not get_movie_reviews("tt0111161"):
        print("\n❌ Failed to fetch reviews")
        return
    
    print("\n" + "=" * 60)
    print("✅ All review system tests passed!")
    print("\n📝 Next steps:")
    print("1. Open http://localhost:3000/movies/tt0111161 in browser")
    print("2. Scroll to the Reviews section")
    print("3. Verify reviews are displayed correctly")
    print("4. Click 'Write a Review' button")
    print("5. Submit a new review from the UI")
    print("6. Verify the new review appears in the list")

if __name__ == "__main__":
    main()

