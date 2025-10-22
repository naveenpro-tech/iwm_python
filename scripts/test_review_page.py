#!/usr/bin/env python3
"""
Test script for the full review page.
Tests fetching a single review with all required data.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_get_review():
    """Test fetching a single review"""
    print("🔍 Testing GET /api/v1/reviews/{reviewId}...")
    
    # First, get a list of reviews to find a review ID
    print("\n📋 Fetching reviews list to get a review ID...")
    response = requests.get(f"{BASE_URL}/api/v1/reviews?limit=1")
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch reviews list: {response.status_code}")
        print(response.text)
        return
    
    reviews = response.json()
    if not reviews or len(reviews) == 0:
        print("❌ No reviews found in database")
        return
    
    review_id = reviews[0]["id"]
    print(f"✅ Found review ID: {review_id}")
    
    # Now fetch the full review
    print(f"\n📖 Fetching full review data for {review_id}...")
    response = requests.get(f"{BASE_URL}/api/v1/reviews/{review_id}")
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch review: {response.status_code}")
        print(response.text)
        return
    
    review = response.json()
    print("✅ Successfully fetched review!")
    
    # Validate the response structure
    print("\n🔍 Validating response structure...")
    
    required_fields = [
        "id", "content", "rating", "createdAt", "isSpoiler",
        "reviewer", "movie", "engagement"
    ]
    
    missing_fields = []
    for field in required_fields:
        if field not in review:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"❌ Missing required fields: {', '.join(missing_fields)}")
    else:
        print("✅ All required top-level fields present")
    
    # Validate reviewer object
    if "reviewer" in review:
        reviewer_fields = ["id", "username", "avatarUrl", "isVerifiedReviewer", "totalReviews", "followerCount"]
        missing_reviewer_fields = [f for f in reviewer_fields if f not in review["reviewer"]]
        if missing_reviewer_fields:
            print(f"❌ Missing reviewer fields: {', '.join(missing_reviewer_fields)}")
        else:
            print("✅ All reviewer fields present")
    
    # Validate movie object
    if "movie" in review:
        movie_fields = ["id", "title", "releaseYear", "posterUrl", "backdropUrl", "sidduScore"]
        missing_movie_fields = [f for f in movie_fields if f not in review["movie"]]
        if missing_movie_fields:
            print(f"❌ Missing movie fields: {', '.join(missing_movie_fields)}")
        else:
            print("✅ All movie fields present")
    
    # Validate engagement object
    if "engagement" in review:
        engagement_fields = ["likes", "commentsCount", "userHasLiked"]
        missing_engagement_fields = [f for f in engagement_fields if f not in review["engagement"]]
        if missing_engagement_fields:
            print(f"❌ Missing engagement fields: {', '.join(missing_engagement_fields)}")
        else:
            print("✅ All engagement fields present")
    
    # Print the review data
    print("\n📊 Review Data:")
    print(f"   ID: {review.get('id')}")
    print(f"   Rating: {review.get('rating')}/10")
    print(f"   Title: {review.get('title', 'No title')}")
    print(f"   Spoiler: {review.get('isSpoiler')}")
    print(f"   Created: {review.get('createdAt')}")
    
    if "reviewer" in review:
        print(f"\n👤 Reviewer:")
        print(f"   Username: {review['reviewer'].get('username')}")
        print(f"   Verified: {review['reviewer'].get('isVerifiedReviewer')}")
        print(f"   Total Reviews: {review['reviewer'].get('totalReviews')}")
    
    if "movie" in review:
        print(f"\n🎬 Movie:")
        print(f"   Title: {review['movie'].get('title')}")
        print(f"   Year: {review['movie'].get('releaseYear')}")
        print(f"   SidduScore: {review['movie'].get('sidduScore')}")
    
    if "engagement" in review:
        print(f"\n💬 Engagement:")
        print(f"   Likes: {review['engagement'].get('likes')}")
        print(f"   Comments: {review['engagement'].get('commentsCount')}")
    
    print(f"\n✅ Review page data is ready!")
    print(f"🌐 Frontend URL: http://localhost:3000/reviews/{review_id}")

if __name__ == "__main__":
    print("=" * 60)
    print("Testing Full Review Page API")
    print("=" * 60)
    
    test_get_review()
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
    print("=" * 60)

