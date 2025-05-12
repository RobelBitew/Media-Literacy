import instaloader
import time


def fetch_posts(profile_name, limit=5):
    L = instaloader.Instaloader()
    profile = instaloader.Profile.from_username(L.context, profile_name)
    posts = profile.get_posts()
    result = []
    for post in posts:
        result.append(post.caption)
        time.sleep(2) 
        if len(result) >= limit:
            break
    return result
