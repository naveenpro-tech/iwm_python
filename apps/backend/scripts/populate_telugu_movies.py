"""
Populate database with Telugu movies and user profile data.
Run this script to populate the database with 200+ Telugu movies and complete user data.

Usage:
    cd apps/backend
    python scripts/populate_telugu_movies.py
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import random
from src.models import Movie, User, Watchlist, Favorite, Collection, Review, Genre, movie_genres, collection_movies
from sqlalchemy import select, insert

# Database connection
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5433/iwm"

# Telugu Movies Data (200+ movies)
TELUGU_MOVIES = [
    # Blockbusters
    {"title": "RRR", "year": "2022", "runtime": 187, "siddu_score": 9.2, "genres": ["Action", "Drama", "History"], "language": "Telugu", "overview": "A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s."},
    {"title": "Baahubali: The Beginning", "year": "2015", "runtime": 159, "siddu_score": 8.9, "genres": ["Action", "Adventure", "Fantasy"], "language": "Telugu", "overview": "In ancient India, an adventurous and daring man becomes involved in a decades-old feud between two warring peoples."},
    {"title": "Baahubali 2: The Conclusion", "year": "2017", "runtime": 167, "siddu_score": 9.1, "genres": ["Action", "Adventure", "Fantasy"], "language": "Telugu", "overview": "When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers."},
    {"title": "Pushpa: The Rise", "year": "2021", "runtime": 179, "siddu_score": 8.5, "genres": ["Action", "Crime", "Thriller"], "language": "Telugu", "overview": "Violence erupts between red sandalwood smugglers and the police charged with bringing down their organization."},
    {"title": "Eega", "year": "2012", "runtime": 134, "siddu_score": 8.7, "genres": ["Action", "Fantasy", "Romance"], "language": "Telugu", "overview": "A murdered man is reincarnated as a housefly and seeks to avenge his death."},
    
    # Critically Acclaimed
    {"title": "Arjun Reddy", "year": "2017", "runtime": 182, "siddu_score": 8.3, "genres": ["Drama", "Romance"], "language": "Telugu", "overview": "Arjun Reddy, a short-tempered house surgeon, gets used to drugs and drinks when his girlfriend is forced to marry another person."},
    {"title": "Rangasthalam", "year": "2018", "runtime": 179, "siddu_score": 8.6, "genres": ["Action", "Drama"], "language": "Telugu", "overview": "The fear of his elder brother's death starts to haunt an innocent, hearing impaired guy after they both join forces to overthrow the unlawful 30 year long regime of their village's president."},
    {"title": "Ala Vaikunthapurramuloo", "year": "2020", "runtime": 165, "siddu_score": 8.2, "genres": ["Action", "Drama", "Family"], "language": "Telugu", "overview": "After growing up enduring criticism from his father, a young man finds his world shaken upon learning he was switched at birth with a millionaire's son."},
    {"title": "Srimanthudu", "year": "2015", "runtime": 158, "siddu_score": 8.1, "genres": ["Action", "Drama"], "language": "Telugu", "overview": "Harsha, a multi-millionaire's heir who has everything, still feels that there is something missing in his life. In an attempt to fill the void, he adopts a village to bring change in the people."},
    {"title": "Magadheera", "year": "2009", "runtime": 155, "siddu_score": 8.4, "genres": ["Action", "Fantasy", "Romance"], "language": "Telugu", "overview": "A warrior gets reincarnated 400 years later, after trying to save the princess and the kingdom, who also dies along with him. He then sets back again to fight against all odds and win back his love."},
    
    # Action Thrillers
    {"title": "Sarileru Neekevvaru", "year": "2020", "runtime": 169, "siddu_score": 7.8, "genres": ["Action", "Comedy"], "language": "Telugu", "overview": "An army major sent to Kurnool to give company to his injured colleague's family ends up locking horns with a corrupt minister who is targeting the family."},
    {"title": "Akhanda", "year": "2021", "runtime": 167, "siddu_score": 7.9, "genres": ["Action", "Drama"], "language": "Telugu", "overview": "A fierce warrior rises to protect his tribe from a demon and his evil forces."},
    {"title": "Krack", "year": "2021", "runtime": 140, "siddu_score": 7.7, "genres": ["Action", "Crime"], "language": "Telugu", "overview": "Veera Shankar, a hot-headed cop, forms a rivalry with a notorious crime lord."},
    {"title": "Vakeel Saab", "year": "2021", "runtime": 155, "siddu_score": 7.6, "genres": ["Drama", "Thriller"], "language": "Telugu", "overview": "Three girls find themselves accused of attempt to murder after escaping molestation. Their only hope is an alcoholic lawyer who agrees to take up the case."},
    {"title": "Bheemla Nayak", "year": "2022", "runtime": 145, "siddu_score": 7.5, "genres": ["Action", "Drama"], "language": "Telugu", "overview": "Things get messy when a cop and a politician cross paths."},
    
    # Romantic Dramas
    {"title": "Geetha Govindam", "year": "2018", "runtime": 143, "siddu_score": 8.0, "genres": ["Comedy", "Romance"], "language": "Telugu", "overview": "An innocent young lecturer is misunderstood as a pervert and despised by a woman who co-incidentally turns out to be the younger sister of his brother-in-law."},
    {"title": "Fidaa", "year": "2017", "runtime": 148, "siddu_score": 7.9, "genres": ["Comedy", "Romance"], "language": "Telugu", "overview": "A love story that weaves through the lives of two people from different backgrounds."},
    {"title": "Pelli Choopulu", "year": "2016", "runtime": 125, "siddu_score": 8.2, "genres": ["Comedy", "Romance"], "language": "Telugu", "overview": "Two individuals who are poles apart meet through an arranged marriage setup and develop a bond."},
    {"title": "Mahanati", "year": "2018", "runtime": 177, "siddu_score": 8.8, "genres": ["Biography", "Drama"], "language": "Telugu", "overview": "Biographical film based on the life of Savitri, one of the finest actresses in the history of Indian cinema."},
    {"title": "C/o Kancharapalem", "year": "2018", "runtime": 153, "siddu_score": 8.5, "genres": ["Drama", "Romance"], "language": "Telugu", "overview": "Four love stories set in the town of Kancharapalem."},
    
    # Family Entertainers
    {"title": "F2: Fun and Frustration", "year": "2019", "runtime": 148, "siddu_score": 7.4, "genres": ["Comedy", "Family"], "language": "Telugu", "overview": "After Venky, Varun also gets married thinking he can keep the wife in control but both of them get frustrated with the marital life which generates fun."},
    {"title": "F3: Fun and Frustration", "year": "2022", "runtime": 148, "siddu_score": 7.2, "genres": ["Comedy", "Family"], "language": "Telugu", "overview": "Venky and Varun, who try to come up from financial problems. But what will happen when they meet Pragathi Family who are greedy for money?"},
    {"title": "Attarintiki Daredi", "year": "2013", "runtime": 170, "siddu_score": 7.8, "genres": ["Action", "Comedy", "Drama"], "language": "Telugu", "overview": "The scion of a powerful family is tasked with retrieving an estranged family member."},
    {"title": "Seethamma Vakitlo Sirimalle Chettu", "year": "2013", "runtime": 159, "siddu_score": 7.7, "genres": ["Drama", "Family"], "language": "Telugu", "overview": "An exuberant and evocative family drama, that primarily revolves around the close bond between two brothers with radically different personalities."},
    {"title": "Oopiri", "year": "2016", "runtime": 158, "siddu_score": 8.3, "genres": ["Comedy", "Drama"], "language": "Telugu", "overview": "Impressed by his carefree attitude, quadriplegic multi-billionaire Vikram hires a convict out on parole as his caretaker."},
]

# Add more Telugu movies to reach 200+
ADDITIONAL_TELUGU_MOVIES = [
    {"title": "Khaidi No. 150", "year": "2017", "runtime": 146, "siddu_score": 7.3, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Janatha Garage", "year": "2016", "runtime": 162, "siddu_score": 7.6, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Nannaku Prematho", "year": "2016", "runtime": 169, "siddu_score": 7.7, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Temper", "year": "2015", "runtime": 147, "siddu_score": 7.8, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Race Gurram", "year": "2014", "runtime": 163, "siddu_score": 7.5, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Mirchi", "year": "2013", "runtime": 160, "siddu_score": 7.6, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Dookudu", "year": "2011", "runtime": 175, "siddu_score": 7.7, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Gabbar Singh", "year": "2012", "runtime": 145, "siddu_score": 7.4, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Businessman", "year": "2012", "runtime": 131, "siddu_score": 7.3, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Khaleja", "year": "2010", "runtime": 170, "siddu_score": 7.5, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Pokiri", "year": "2006", "runtime": 155, "siddu_score": 8.0, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Athadu", "year": "2005", "runtime": 172, "siddu_score": 8.1, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Simhadri", "year": "2003", "runtime": 175, "siddu_score": 7.6, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Okkadu", "year": "2003", "runtime": 171, "siddu_score": 8.2, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Indra", "year": "2002", "runtime": 173, "siddu_score": 7.7, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Tagore", "year": "2003", "runtime": 165, "siddu_score": 7.5, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Shankar Dada MBBS", "year": "2004", "runtime": 170, "siddu_score": 7.8, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Bommarillu", "year": "2006", "runtime": 168, "siddu_score": 8.3, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Parugu", "year": "2008", "runtime": 155, "siddu_score": 7.4, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Kick", "year": "2009", "runtime": 145, "siddu_score": 7.3, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Brindavanam", "year": "2010", "runtime": 155, "siddu_score": 7.5, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Julayi", "year": "2012", "runtime": 163, "siddu_score": 7.6, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Baadshah", "year": "2013", "runtime": 165, "siddu_score": 7.2, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Ramayya Vasthavayya", "year": "2013", "runtime": 155, "siddu_score": 7.1, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Rabhasa", "year": "2014", "runtime": 145, "siddu_score": 6.9, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Aagadu", "year": "2014", "runtime": 165, "siddu_score": 6.8, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Govindudu Andarivadele", "year": "2014", "runtime": 160, "siddu_score": 7.3, "genres": ["Drama", "Family"], "language": "Telugu"},
    {"title": "Srimanthudu", "year": "2015", "runtime": 158, "siddu_score": 8.1, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Bhale Bhale Magadivoy", "year": "2015", "runtime": 142, "siddu_score": 7.7, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Soggade Chinni Nayana", "year": "2016", "runtime": 150, "siddu_score": 7.6, "genres": ["Comedy", "Fantasy"], "language": "Telugu"},
    {"title": "A Aa", "year": "2016", "runtime": 150, "siddu_score": 7.8, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Sarrainodu", "year": "2016", "runtime": 160, "siddu_score": 7.2, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Dhruva", "year": "2016", "runtime": 158, "siddu_score": 7.7, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Katamarayudu", "year": "2017", "runtime": 145, "siddu_score": 6.7, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Winner", "year": "2017", "runtime": 142, "siddu_score": 6.8, "genres": ["Action", "Romance"], "language": "Telugu"},
    {"title": "Khaidi", "year": "2019", "runtime": 143, "siddu_score": 8.0, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Saaho", "year": "2019", "runtime": 170, "siddu_score": 7.1, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Maharshi", "year": "2019", "runtime": 175, "siddu_score": 7.8, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Venky Mama", "year": "2019", "runtime": 150, "siddu_score": 7.2, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Ala Vaikunthapurramuloo", "year": "2020", "runtime": 165, "siddu_score": 8.2, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Disco Raja", "year": "2020", "runtime": 148, "siddu_score": 6.9, "genres": ["Action", "Sci-Fi"], "language": "Telugu"},
    {"title": "Solo Brathuke So Better", "year": "2020", "runtime": 119, "siddu_score": 7.0, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Red", "year": "2021", "runtime": 147, "siddu_score": 7.1, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Jathi Ratnalu", "year": "2021", "runtime": 145, "siddu_score": 7.8, "genres": ["Comedy"], "language": "Telugu"},
    {"title": "Uppena", "year": "2021", "runtime": 149, "siddu_score": 7.9, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Love Story", "year": "2021", "runtime": 142, "siddu_score": 7.5, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Most Eligible Bachelor", "year": "2021", "runtime": 151, "siddu_score": 7.3, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Shyam Singha Roy", "year": "2021", "runtime": 163, "siddu_score": 7.7, "genres": ["Drama", "Fantasy"], "language": "Telugu"},
    {"title": "Bangarraju", "year": "2022", "runtime": 135, "siddu_score": 7.2, "genres": ["Comedy", "Fantasy"], "language": "Telugu"},
    {"title": "Acharya", "year": "2022", "runtime": 140, "siddu_score": 6.5, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Sarkaru Vaari Paata", "year": "2022", "runtime": 162, "siddu_score": 7.0, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "F3", "year": "2022", "runtime": 148, "siddu_score": 7.2, "genres": ["Comedy", "Family"], "language": "Telugu"},
    {"title": "Vikram", "year": "2022", "runtime": 174, "siddu_score": 8.4, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Liger", "year": "2022", "runtime": 140, "siddu_score": 6.3, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Godfather", "year": "2022", "runtime": 157, "siddu_score": 7.1, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "The Ghost", "year": "2022", "runtime": 139, "siddu_score": 6.8, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Sita Ramam", "year": "2022", "runtime": 163, "siddu_score": 8.6, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Bimbisara", "year": "2022", "runtime": 142, "siddu_score": 7.6, "genres": ["Action", "Fantasy"], "language": "Telugu"},
    {"title": "Karthikeya 2", "year": "2022", "runtime": 145, "siddu_score": 7.8, "genres": ["Adventure", "Thriller"], "language": "Telugu"},
    {"title": "Ante Sundaraniki", "year": "2022", "runtime": 173, "siddu_score": 7.9, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "DJ Tillu", "year": "2022", "runtime": 125, "siddu_score": 7.4, "genres": ["Comedy", "Crime"], "language": "Telugu"},
    {"title": "Khiladi", "year": "2022", "runtime": 145, "siddu_score": 6.7, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Radhe Shyam", "year": "2022", "runtime": 138, "siddu_score": 6.9, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Waltair Veerayya", "year": "2023", "runtime": 155, "siddu_score": 7.5, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Veera Simha Reddy", "year": "2023", "runtime": 162, "siddu_score": 7.3, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Dasara", "year": "2023", "runtime": 156, "siddu_score": 7.9, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Kisi Ka Bhai Kisi Ki Jaan", "year": "2023", "runtime": 145, "siddu_score": 6.5, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Agent", "year": "2023", "runtime": 140, "siddu_score": 6.4, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Custody", "year": "2023", "runtime": 145, "siddu_score": 6.8, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Virupaksha", "year": "2023", "runtime": 145, "siddu_score": 7.7, "genres": ["Horror", "Thriller"], "language": "Telugu"},
    {"title": "Samajavaragamana", "year": "2023", "runtime": 130, "siddu_score": 7.2, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Bhola Shankar", "year": "2023", "runtime": 150, "siddu_score": 6.6, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "King of Kotha", "year": "2023", "runtime": 155, "siddu_score": 7.0, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Skanda", "year": "2023", "runtime": 162, "siddu_score": 6.9, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Tiger Nageswara Rao", "year": "2023", "runtime": 175, "siddu_score": 7.2, "genres": ["Action", "Biography"], "language": "Telugu"},
    {"title": "Leo", "year": "2023", "runtime": 164, "siddu_score": 7.8, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Extra Ordinary Man", "year": "2023", "runtime": 145, "siddu_score": 6.7, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Hi Nanna", "year": "2023", "runtime": 140, "siddu_score": 7.9, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Salaar", "year": "2023", "runtime": 175, "siddu_score": 8.1, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Guntur Kaaram", "year": "2024", "runtime": 159, "siddu_score": 7.4, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Hanuman", "year": "2024", "runtime": 158, "siddu_score": 8.2, "genres": ["Action", "Fantasy"], "language": "Telugu"},
    {"title": "Eagle", "year": "2024", "runtime": 166, "siddu_score": 7.3, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Tillu Square", "year": "2024", "runtime": 135, "siddu_score": 7.6, "genres": ["Comedy", "Crime"], "language": "Telugu"},
    {"title": "Bhimaa", "year": "2024", "runtime": 145, "siddu_score": 6.8, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Operation Valentine", "year": "2024", "runtime": 142, "siddu_score": 7.0, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Premalu", "year": "2024", "runtime": 155, "siddu_score": 8.0, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Gaami", "year": "2024", "runtime": 147, "siddu_score": 7.8, "genres": ["Adventure", "Drama"], "language": "Telugu"},
    {"title": "Bhaje Vaayu Vegam", "year": "2024", "runtime": 138, "siddu_score": 7.2, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Kalki 2898 AD", "year": "2024", "runtime": 180, "siddu_score": 8.7, "genres": ["Action", "Sci-Fi"], "language": "Telugu"},
    {"title": "Devara", "year": "2024", "runtime": 175, "siddu_score": 8.0, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Game Changer", "year": "2024", "runtime": 165, "siddu_score": 7.9, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Pushpa 2: The Rule", "year": "2024", "runtime": 185, "siddu_score": 8.8, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "OG", "year": "2024", "runtime": 160, "siddu_score": 7.7, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Spirit", "year": "2024", "runtime": 155, "siddu_score": 7.6, "genres": ["Action", "Crime"], "language": "Telugu"},
    {"title": "Ustaad Bhagat Singh", "year": "2024", "runtime": 150, "siddu_score": 7.5, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Hari Hara Veera Mallu", "year": "2024", "runtime": 170, "siddu_score": 7.8, "genres": ["Action", "History"], "language": "Telugu"},
    {"title": "Adipurush", "year": "2023", "runtime": 179, "siddu_score": 6.2, "genres": ["Action", "Fantasy"], "language": "Telugu"},
    {"title": "Bro", "year": "2023", "runtime": 134, "siddu_score": 7.1, "genres": ["Comedy", "Fantasy"], "language": "Telugu"},
    {"title": "Mem Famous", "year": "2023", "runtime": 147, "siddu_score": 7.5, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Writer Padmabhushan", "year": "2023", "runtime": 125, "siddu_score": 7.4, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Balagam", "year": "2023", "runtime": 135, "siddu_score": 8.1, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Bedurulanka 2012", "year": "2023", "runtime": 142, "siddu_score": 7.3, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Organic Mama Hybrid Alludu", "year": "2023", "runtime": 130, "siddu_score": 6.9, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Ravanasura", "year": "2023", "runtime": 145, "siddu_score": 7.0, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Nenu Student Sir", "year": "2023", "runtime": 125, "siddu_score": 6.8, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Vinaro Bhagyamu Vishnu Katha", "year": "2023", "runtime": 140, "siddu_score": 7.2, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Keedaa Cola", "year": "2023", "runtime": 120, "siddu_score": 7.6, "genres": ["Comedy", "Crime"], "language": "Telugu"},
    {"title": "Changure Bangaru Raja", "year": "2023", "runtime": 135, "siddu_score": 7.1, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Pareshan", "year": "2023", "runtime": 115, "siddu_score": 7.7, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Baby", "year": "2023", "runtime": 130, "siddu_score": 7.4, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Butta Bomma", "year": "2023", "runtime": 125, "siddu_score": 7.0, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Anni Manchi Sakunamule", "year": "2023", "runtime": 140, "siddu_score": 7.3, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Maa Oori Polimera 2", "year": "2023", "runtime": 108, "siddu_score": 7.2, "genres": ["Horror", "Thriller"], "language": "Telugu"},
    {"title": "18 Pages", "year": "2022", "runtime": 140, "siddu_score": 7.1, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Vaathi", "year": "2023", "runtime": 145, "siddu_score": 7.8, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Sir", "year": "2023", "runtime": 145, "siddu_score": 7.8, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Dhamaka", "year": "2022", "runtime": 135, "siddu_score": 7.0, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Ori Devuda", "year": "2022", "runtime": 135, "siddu_score": 7.3, "genres": ["Comedy", "Fantasy"], "language": "Telugu"},
    {"title": "Sardar", "year": "2022", "runtime": 165, "siddu_score": 7.7, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Prince", "year": "2022", "runtime": 130, "siddu_score": 6.5, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Macherla Niyojakavargam", "year": "2022", "runtime": 145, "siddu_score": 6.9, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Aa Ammayi Gurinchi Meeku Cheppali", "year": "2022", "runtime": 145, "siddu_score": 7.5, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Oke Oka Jeevitham", "year": "2022", "runtime": 140, "siddu_score": 7.6, "genres": ["Drama", "Sci-Fi"], "language": "Telugu"},
    {"title": "Godse", "year": "2022", "runtime": 130, "siddu_score": 6.7, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Pakka Commercial", "year": "2022", "runtime": 145, "siddu_score": 7.0, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Aadavallu Meeku Johaarlu", "year": "2022", "runtime": 145, "siddu_score": 6.8, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Ghani", "year": "2022", "runtime": 160, "siddu_score": 6.6, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Shivam Bhaje", "year": "2024", "runtime": 135, "siddu_score": 7.1, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Mathu Vadalara 2", "year": "2024", "runtime": 130, "siddu_score": 7.4, "genres": ["Comedy", "Crime"], "language": "Telugu"},
    {"title": "Saripodhaa Sanivaaram", "year": "2024", "runtime": 145, "siddu_score": 7.7, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Double iSmart", "year": "2024", "runtime": 140, "siddu_score": 6.9, "genres": ["Action", "Sci-Fi"], "language": "Telugu"},
    {"title": "Mr. Bachchan", "year": "2024", "runtime": 150, "siddu_score": 7.0, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Committee Kurrollu", "year": "2024", "runtime": 125, "siddu_score": 7.5, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Aay", "year": "2024", "runtime": 120, "siddu_score": 7.3, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Maruthi Nagar Subramanyam", "year": "2024", "runtime": 130, "siddu_score": 7.2, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Kalki", "year": "2019", "runtime": 140, "siddu_score": 7.4, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Evaru", "year": "2019", "runtime": 118, "siddu_score": 7.9, "genres": ["Crime", "Thriller"], "language": "Telugu"},
    {"title": "Jersey", "year": "2019", "runtime": 157, "siddu_score": 8.4, "genres": ["Drama", "Sport"], "language": "Telugu"},
    {"title": "Dear Comrade", "year": "2019", "runtime": 170, "siddu_score": 7.6, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Majili", "year": "2019", "runtime": 154, "siddu_score": 7.7, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Chitralahari", "year": "2019", "runtime": 150, "siddu_score": 7.3, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Taxiwaala", "year": "2018", "runtime": 118, "siddu_score": 7.5, "genres": ["Comedy", "Horror"], "language": "Telugu"},
    {"title": "Goodachari", "year": "2018", "runtime": 147, "siddu_score": 8.0, "genres": ["Action", "Thriller"], "language": "Telugu"},
    {"title": "Bharat Ane Nenu", "year": "2018", "runtime": 173, "siddu_score": 7.9, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Awe", "year": "2018", "runtime": 115, "siddu_score": 7.8, "genres": ["Drama", "Thriller"], "language": "Telugu"},
    {"title": "Tholi Prema", "year": "2018", "runtime": 138, "siddu_score": 7.6, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Ninnu Kori", "year": "2017", "runtime": 126, "siddu_score": 7.7, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Pellichoopulu", "year": "2016", "runtime": 125, "siddu_score": 8.2, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Kshanam", "year": "2016", "runtime": 118, "siddu_score": 8.1, "genres": ["Crime", "Thriller"], "language": "Telugu"},
    {"title": "Pilla Zamindar", "year": "2011", "runtime": 140, "siddu_score": 7.8, "genres": ["Comedy", "Drama"], "language": "Telugu"},
    {"title": "Eega", "year": "2012", "runtime": 134, "siddu_score": 8.7, "genres": ["Action", "Fantasy"], "language": "Telugu"},
    {"title": "Maryada Ramanna", "year": "2010", "runtime": 125, "siddu_score": 7.9, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Vikramarkudu", "year": "2006", "runtime": 155, "siddu_score": 7.7, "genres": ["Action", "Comedy"], "language": "Telugu"},
    {"title": "Chatrapathi", "year": "2005", "runtime": 175, "siddu_score": 7.8, "genres": ["Action", "Drama"], "language": "Telugu"},
    {"title": "Sye", "year": "2004", "runtime": 165, "siddu_score": 7.6, "genres": ["Action", "Sport"], "language": "Telugu"},
    {"title": "Arya", "year": "2004", "runtime": 165, "siddu_score": 7.9, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Nuvvostanante Nenoddantana", "year": "2005", "runtime": 175, "siddu_score": 7.8, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Anand", "year": "2004", "runtime": 165, "siddu_score": 7.7, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Nuvve Nuvve", "year": "2002", "runtime": 155, "siddu_score": 7.5, "genres": ["Drama", "Romance"], "language": "Telugu"},
    {"title": "Kushi", "year": "2001", "runtime": 175, "siddu_score": 7.9, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Nuvvu Naaku Nachav", "year": "2001", "runtime": 155, "siddu_score": 7.6, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Manmadhudu", "year": "2002", "runtime": 142, "siddu_score": 7.7, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Santosham", "year": "2002", "runtime": 170, "siddu_score": 7.8, "genres": ["Drama", "Family"], "language": "Telugu"},
    {"title": "Malliswari", "year": "2004", "runtime": 150, "siddu_score": 7.4, "genres": ["Comedy", "Romance"], "language": "Telugu"},
    {"title": "Gharshana", "year": "2004", "runtime": 145, "siddu_score": 7.5, "genres": ["Action", "Thriller"], "language": "Telugu"},
]

# Combine all movies
ALL_TELUGU_MOVIES = TELUGU_MOVIES + ADDITIONAL_TELUGU_MOVIES


async def populate_database():
    """Main function to populate the database"""
    engine = create_async_engine(DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        print("🎬 Starting Telugu Movies Database Population...")
        
        # Step 1: Get or create genres
        print("\n📁 Step 1: Creating genres...")
        genre_names = ["Action", "Drama", "Romance", "Comedy", "Thriller", "Fantasy", "Adventure", "Crime", "Family", "Biography", "History"]
        genre_map = {}
        
        for genre_name in genre_names:
            result = await session.execute(select(Genre).where(Genre.name == genre_name))
            genre = result.scalar_one_or_none()
            if not genre:
                genre = Genre(slug=genre_name.lower(), name=genre_name)
                session.add(genre)
                await session.flush()
            genre_map[genre_name] = genre
        
        await session.commit()
        print(f"✅ Created {len(genre_map)} genres")
        
        # Step 2: Create Telugu movies
        print("\n🎥 Step 2: Creating 200+ Telugu movies...")
        movie_ids = []
        
        for idx, movie_data in enumerate(ALL_TELUGU_MOVIES[:200], 1):  # Limit to 200 for now
            # Check if movie already exists
            result = await session.execute(select(Movie).where(Movie.title == movie_data["title"]))
            existing_movie = result.scalar_one_or_none()
            
            if existing_movie:
                movie_ids.append(existing_movie.id)
                continue
            
            movie = Movie(
                external_id=f"telugu-movie-{idx}",
                title=movie_data["title"],
                year=movie_data.get("year"),
                runtime=movie_data.get("runtime"),
                siddu_score=movie_data.get("siddu_score"),
                language=movie_data.get("language", "Telugu"),
                overview=movie_data.get("overview", f"A Telugu cinema masterpiece - {movie_data['title']}"),
                poster_url=f"/placeholder.svg?text={movie_data['title'].replace(' ', '+')}",
                status="released"
            )
            session.add(movie)
            await session.flush()
            
            # Add genres
            for genre_name in movie_data.get("genres", []):
                if genre_name in genre_map:
                    await session.execute(
                        insert(movie_genres).values(movie_id=movie.id, genre_id=genre_map[genre_name].id)
                    )
            
            movie_ids.append(movie.id)
            
            if idx % 50 == 0:
                print(f"  Created {idx} movies...")
        
        await session.commit()
        print(f"✅ Created {len(movie_ids)} Telugu movies")
        
        # Step 3: Get or create user
        print("\n👤 Step 3: Setting up user profile...")
        result = await session.execute(select(User).where(User.email == "siddharth@example.com"))
        user = result.scalar_one_or_none()

        if not user:
            # Simple password hashing for demo purposes
            import hashlib
            password = "password123"
            hashed_password = hashlib.sha256(password.encode()).hexdigest()

            user = User(
                external_id="user-siddu-1",
                email="siddharth@example.com",
                name="Siddu Kumar",
                hashed_password=hashed_password,
                avatar_url="/placeholder.svg?text=SK"
            )
            session.add(user)
            await session.flush()

        await session.commit()
        print(f"✅ User profile ready: {user.name}")

        # Step 4: Create Watchlist (43+ items)
        print("\n📋 Step 4: Creating watchlist (43+ items)...")
        watchlist_count = 0
        priorities = ["high", "medium", "low"]
        statuses = ["want-to-watch", "watching", "watched"]

        for idx, movie_id in enumerate(random.sample(movie_ids, min(50, len(movie_ids)))):
            # Check if already in watchlist
            result = await session.execute(
                select(Watchlist).where(Watchlist.user_id == user.id, Watchlist.movie_id == movie_id)
            )
            if result.scalar_one_or_none():
                continue

            watchlist_item = Watchlist(
                external_id=f"watchlist-{user.id}-{movie_id}",
                user_id=user.id,
                movie_id=movie_id,
                status=random.choice(statuses),
                priority=random.choice(priorities),
                progress=random.randint(0, 100) if random.random() > 0.5 else 0,
                date_added=datetime.utcnow() - timedelta(days=random.randint(1, 365))
            )
            session.add(watchlist_item)
            watchlist_count += 1

            if watchlist_count >= 43:
                break

        await session.commit()
        print(f"✅ Created {watchlist_count} watchlist items")

        # Step 5: Create Favorites (68+ items)
        print("\n❤️ Step 5: Creating favorites (68+ items)...")
        favorites_count = 0

        for idx, movie_id in enumerate(random.sample(movie_ids, min(75, len(movie_ids)))):
            # Check if already in favorites
            result = await session.execute(
                select(Favorite).where(Favorite.user_id == user.id, Favorite.movie_id == movie_id)
            )
            if result.scalar_one_or_none():
                continue

            favorite_item = Favorite(
                external_id=f"favorite-{user.id}-{movie_id}",
                user_id=user.id,
                movie_id=movie_id,
                type="movie",
                added_date=datetime.utcnow() - timedelta(days=random.randint(1, 730))
            )
            session.add(favorite_item)
            favorites_count += 1

            if favorites_count >= 68:
                break

        await session.commit()
        print(f"✅ Created {favorites_count} favorite items")

        # Step 6: Create Collections (6+ collections)
        print("\n📚 Step 6: Creating collections (6+ collections)...")
        collections_data = [
            {"title": "Best Telugu Action Films", "description": "High-octane Telugu action movies that redefined the genre", "is_public": True},
            {"title": "Rajamouli Masterpieces", "description": "Epic films by the legendary director S.S. Rajamouli", "is_public": True},
            {"title": "Telugu Classics", "description": "Timeless Telugu cinema that shaped the industry", "is_public": True},
            {"title": "Romantic Telugu Gems", "description": "Beautiful love stories from Telugu cinema", "is_public": True},
            {"title": "Must-Watch Telugu Thrillers", "description": "Edge-of-your-seat Telugu thriller movies", "is_public": False},
            {"title": "Family Entertainers", "description": "Perfect Telugu movies for family viewing", "is_public": True},
        ]

        collection_ids = []
        for idx, coll_data in enumerate(collections_data, 1):
            collection = Collection(
                external_id=f"collection-{user.id}-{idx}",
                user_id=user.id,
                title=coll_data["title"],
                description=coll_data["description"],
                is_public=coll_data["is_public"],
                followers=random.randint(10, 500)
            )
            session.add(collection)
            await session.flush()

            # Add 5-15 random movies to each collection
            num_movies = random.randint(5, 15)
            for movie_id in random.sample(movie_ids, min(num_movies, len(movie_ids))):
                await session.execute(
                    insert(collection_movies).values(collection_id=collection.id, movie_id=movie_id)
                )

            collection_ids.append(collection.id)

        await session.commit()
        print(f"✅ Created {len(collection_ids)} collections")

        # Step 7: Create Reviews (127+ reviews)
        print("\n✍️ Step 7: Creating reviews (127+ reviews)...")
        reviews_count = 0
        review_templates = [
            "An absolute masterpiece! {title} showcases the best of Telugu cinema.",
            "Brilliant performances and stunning visuals make {title} a must-watch.",
            "{title} is a game-changer for Telugu cinema. Highly recommended!",
            "Loved every minute of {title}. The storytelling is exceptional.",
            "A visual spectacle! {title} sets new standards for Indian cinema.",
        ]

        for idx, movie_id in enumerate(random.sample(movie_ids, min(135, len(movie_ids)))):
            # Get movie title
            result = await session.execute(select(Movie).where(Movie.id == movie_id))
            movie = result.scalar_one_or_none()
            if not movie:
                continue

            review = Review(
                external_id=f"review-{user.id}-{movie_id}",
                user_id=user.id,
                movie_id=movie_id,
                rating=round(random.uniform(6.0, 10.0), 1),
                title=f"Review of {movie.title}",
                content=random.choice(review_templates).format(title=movie.title),
                has_spoilers=random.choice([True, False]),
                date=datetime.utcnow() - timedelta(days=random.randint(1, 730))
            )
            session.add(review)
            reviews_count += 1

            if reviews_count >= 127:
                break

        await session.commit()
        print(f"✅ Created {reviews_count} reviews")

        print("\n✨ Database population complete!")
        print(f"📊 Summary:")
        print(f"  - Telugu Movies: {len(movie_ids)}")
        print(f"  - Genres: {len(genre_map)}")
        print(f"  - User: {user.name}")
        print(f"  - Watchlist Items: {watchlist_count}")
        print(f"  - Favorite Items: {favorites_count}")
        print(f"  - Collections: {len(collection_ids)}")
        print(f"  - Reviews: {reviews_count}")
        print(f"\n🎉 Ready to integrate with frontend!")


if __name__ == "__main__":
    asyncio.run(populate_database())

