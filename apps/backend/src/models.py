from __future__ import annotations

from typing import List
from datetime import datetime
from sqlalchemy import String, ForeignKey, Integer, Table, Column, Text, Float, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base


movie_genres = Table(
    "movie_genres",
    Base.metadata,
    Column("movie_id", ForeignKey("movies.id"), primary_key=True),
    Column("genre_id", ForeignKey("genres.id"), primary_key=True),
)

movie_people = Table(
    "movie_people",
    Base.metadata,
    Column("movie_id", ForeignKey("movies.id"), primary_key=True),
    Column("person_id", ForeignKey("people.id"), primary_key=True),
    Column("role", String(20), nullable=False, default="actor"),
    Column("character_name", String(100), nullable=True),
)

collection_movies = Table(
    "collection_movies",
    Base.metadata,
    Column("collection_id", ForeignKey("collections.id"), primary_key=True),
    Column("movie_id", ForeignKey("movies.id"), primary_key=True),
)




class Genre(Base):
    __tablename__ = "genres"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))

    movies: Mapped[List["Movie"]] = relationship(
        back_populates="genres",
        secondary=movie_genres,
        lazy="selectin",
    )


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    year: Mapped[str | None] = mapped_column(String(4), nullable=True)
    runtime: Mapped[int | None] = mapped_column(Integer, nullable=True)
    siddu_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    language: Mapped[str | None] = mapped_column(String(50), nullable=True)
    country: Mapped[str | None] = mapped_column(String(50), nullable=True)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    poster_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    genres: Mapped[List[Genre]] = relationship(
        back_populates="movies",
        secondary=movie_genres,
        lazy="selectin",
    )

    people: Mapped[List["Person"]] = relationship(
        secondary=movie_people,
        back_populates="movies",
        lazy="selectin",
    )


class Person(Base):
    __tablename__ = "people"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(100))
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    movies: Mapped[List["Movie"]] = relationship(
        secondary=movie_people,
        back_populates="people",
        lazy="selectin",
    )


# Association table for scene genres
scene_genres = Table(
    "scene_genres",
    Base.metadata,
    Column("scene_id", ForeignKey("scenes.id"), primary_key=True),
    Column("genre_id", ForeignKey("genres.id"), primary_key=True),
)


class Scene(Base):
    __tablename__ = "scenes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    duration_str: Mapped[str | None] = mapped_column(String(20), nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)

    scene_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    director: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cinematographer: Mapped[str | None] = mapped_column(String(100), nullable=True)

    view_count: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False)
    is_visual_treat: Mapped[bool] = mapped_column(Boolean, default=False)
    added_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))
    movie: Mapped["Movie"] = relationship(lazy="selectin")

    genres: Mapped[List["Genre"]] = relationship(
        secondary=scene_genres,
        lazy="selectin",
    )



class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)

    reviews: Mapped[List["Review"]] = relationship(back_populates="author", lazy="selectin")


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    rating: Mapped[float] = mapped_column(Float)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    has_spoilers: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    helpful_votes: Mapped[int] = mapped_column(Integer, default=0)
    unhelpful_votes: Mapped[int] = mapped_column(Integer, default=0)
    comment_count: Mapped[int] = mapped_column(Integer, default=0)
    engagement_score: Mapped[int] = mapped_column(Integer, default=0)
    media_urls: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array as text

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))

    author: Mapped["User"] = relationship(back_populates="reviews", lazy="selectin")
    movie: Mapped["Movie"] = relationship(lazy="selectin")


class Collection(Base):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    followers: Mapped[int] = mapped_column(Integer, default=0)
    tags: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array as text
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, onupdate=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    creator: Mapped["User"] = relationship(lazy="selectin")
    movies: Mapped[List["Movie"]] = relationship(secondary=collection_movies, lazy="selectin")



class Watchlist(Base):
    __tablename__ = "watchlist"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    date_added: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(20), default="want-to-watch")  # want-to-watch, watching, watched
    priority: Mapped[str] = mapped_column(String(10), default="medium")  # high, medium, low
    progress: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"))

    user: Mapped["User"] = relationship(lazy="selectin")
    movie: Mapped["Movie"] = relationship(lazy="selectin")


class Favorite(Base):
    __tablename__ = "favorites"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    type: Mapped[str] = mapped_column(String(20))  # movie, person, scene, article
    added_date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    person_id: Mapped[int | None] = mapped_column(ForeignKey("people.id"), nullable=True)

    user: Mapped["User"] = relationship(lazy="selectin")
    movie: Mapped["Movie | None"] = relationship(lazy="selectin")
    person: Mapped["Person | None"] = relationship(lazy="selectin")





class AwardCeremony(Base):
    __tablename__ = "award_ceremonies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)  # e.g., "oscars"
    name: Mapped[str] = mapped_column(String(200))
    short_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    background_image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    current_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    next_ceremony_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    years: Mapped[List["AwardCeremonyYear"]] = relationship(back_populates="ceremony", lazy="selectin")


class AwardCeremonyYear(Base):
    __tablename__ = "award_ceremony_years"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)  # e.g., "oscars-2024"
    year: Mapped[int] = mapped_column(Integer)
    date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    hosted_by: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array as text
    background_image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    highlights: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array as text

    ceremony_id: Mapped[int] = mapped_column(ForeignKey("award_ceremonies.id"))
    ceremony: Mapped["AwardCeremony"] = relationship(back_populates="years", lazy="selectin")

    categories: Mapped[List["AwardCategory"]] = relationship(back_populates="ceremony_year", lazy="selectin")


class AwardCategory(Base):
    __tablename__ = "award_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(200))

    ceremony_year_id: Mapped[int] = mapped_column(ForeignKey("award_ceremony_years.id"))
    ceremony_year: Mapped["AwardCeremonyYear"] = relationship(back_populates="categories", lazy="selectin")

    nominations: Mapped[List["AwardNomination"]] = relationship(back_populates="category", lazy="selectin")


class AwardNomination(Base):
    __tablename__ = "award_nominations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    nominee_type: Mapped[str] = mapped_column(String(30))  # movie | person | song | screenplay
    nominee_name: Mapped[str] = mapped_column(String(200))
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    entity_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    details: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_winner: Mapped[bool] = mapped_column(Boolean, default=False)

    category_id: Mapped[int] = mapped_column(ForeignKey("award_categories.id"))
    category: Mapped["AwardCategory"] = relationship(back_populates="nominations", lazy="selectin")

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    person_id: Mapped[int | None] = mapped_column(ForeignKey("people.id"), nullable=True)

    movie: Mapped["Movie | None"] = relationship(lazy="selectin")
    person: Mapped["Person | None"] = relationship(lazy="selectin")



# Box Office domain models
class BoxOfficeWeekendEntry(Base):
    __tablename__ = "box_office_weekend_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    period_start: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    period_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    rank: Mapped[int] = mapped_column(Integer)

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    movie: Mapped["Movie | None"] = relationship(lazy="selectin")

    weekend_gross_usd: Mapped[float] = mapped_column(Float)
    total_gross_usd: Mapped[float] = mapped_column(Float)
    change_percent: Mapped[float | None] = mapped_column(Float, nullable=True)
    is_positive: Mapped[bool] = mapped_column(Boolean, default=True)
    weeks_in_release: Mapped[int | None] = mapped_column(Integer, nullable=True)
    poster_url: Mapped[str | None] = mapped_column(String(255), nullable=True)


class BoxOfficeTrendPoint(Base):
    __tablename__ = "box_office_trends"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    date: Mapped[datetime] = mapped_column(DateTime)
    gross_millions_usd: Mapped[float] = mapped_column(Float)


class BoxOfficeYTD(Base):
    __tablename__ = "box_office_ytd"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    year: Mapped[int] = mapped_column(Integer, index=True)
    total_gross_usd: Mapped[float] = mapped_column(Float)
    change_percent: Mapped[float] = mapped_column(Float)
    is_positive: Mapped[bool] = mapped_column(Boolean, default=True)
    previous_year: Mapped[int] = mapped_column(Integer)
    previous_total_gross_usd: Mapped[float] = mapped_column(Float)

    top_movies: Mapped[List["BoxOfficeYTDTopMovie"]] = relationship(back_populates="ytd", lazy="selectin")


class BoxOfficeYTDTopMovie(Base):
    __tablename__ = "box_office_ytd_top_movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ytd_id: Mapped[int] = mapped_column(ForeignKey("box_office_ytd.id"))
    title: Mapped[str] = mapped_column(String(200))
    gross_usd: Mapped[float] = mapped_column(Float)

    ytd: Mapped["BoxOfficeYTD"] = relationship(back_populates="top_movies", lazy="selectin")


class BoxOfficeRecord(Base):
    __tablename__ = "box_office_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    category: Mapped[str] = mapped_column(String(100))
    title: Mapped[str] = mapped_column(String(200))
    value_text: Mapped[str] = mapped_column(String(50))
    year: Mapped[str] = mapped_column(String(10))
    poster_url: Mapped[str | None] = mapped_column(String(255), nullable=True)


class BoxOfficePerformanceGenre(Base):
    __tablename__ = "box_office_perf_genre"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    name: Mapped[str] = mapped_column(String(100))
    percent: Mapped[int] = mapped_column(Integer)
    color: Mapped[str] = mapped_column(String(20))


class BoxOfficePerformanceStudio(Base):
    __tablename__ = "box_office_perf_studio"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    studio: Mapped[str] = mapped_column(String(100))
    gross_millions_usd: Mapped[float] = mapped_column(Float)


class BoxOfficePerformanceMonthly(Base):
    __tablename__ = "box_office_perf_monthly"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    region: Mapped[str] = mapped_column(String(50), index=True, default="global")
    month: Mapped[str] = mapped_column(String(10))
    gross_millions_usd: Mapped[float] = mapped_column(Float)



# Festivals domain models
class Festival(Base):
    __tablename__ = "festivals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)  # e.g., "cannes"
    name: Mapped[str] = mapped_column(String(200))
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    website: Mapped[str | None] = mapped_column(String(200), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    founding_year: Mapped[int | None] = mapped_column(Integer, nullable=True)

    editions: Mapped[List["FestivalEdition"]] = relationship(back_populates="festival", lazy="selectin")


class FestivalEdition(Base):
    __tablename__ = "festival_editions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)  # e.g., "cannes-2024"
    year: Mapped[int] = mapped_column(Integer)
    edition_label: Mapped[str | None] = mapped_column(String(50), nullable=True)  # e.g., "77th"
    dates: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str | None] = mapped_column(String(20), nullable=True)  # upcoming | live | past

    festival_id: Mapped[int] = mapped_column(ForeignKey("festivals.id"))
    festival: Mapped["Festival"] = relationship(back_populates="editions", lazy="selectin")

    program_sections: Mapped[List["FestivalProgramSection"]] = relationship(back_populates="edition", lazy="selectin")
    winner_categories: Mapped[List["FestivalWinnerCategory"]] = relationship(back_populates="edition", lazy="selectin")


class FestivalProgramSection(Base):
    __tablename__ = "festival_program_sections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80))  # competition | outOfCompetition | specialScreenings

    edition_id: Mapped[int] = mapped_column(ForeignKey("festival_editions.id"))
    edition: Mapped["FestivalEdition"] = relationship(back_populates="program_sections", lazy="selectin")

    entries: Mapped[List["FestivalProgramEntry"]] = relationship(back_populates="section", lazy="selectin")


class FestivalProgramEntry(Base):
    __tablename__ = "festival_program_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))
    director: Mapped[str | None] = mapped_column(String(100), nullable=True)
    country: Mapped[str | None] = mapped_column(String(100), nullable=True)
    premiere: Mapped[str | None] = mapped_column(String(50), nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    movie: Mapped["Movie | None"] = relationship(lazy="selectin")

    section_id: Mapped[int] = mapped_column(ForeignKey("festival_program_sections.id"))
    section: Mapped["FestivalProgramSection"] = relationship(back_populates="entries", lazy="selectin")


class FestivalWinnerCategory(Base):
    __tablename__ = "festival_winner_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)  # e.g., "palme-dor"
    name: Mapped[str] = mapped_column(String(200))

    edition_id: Mapped[int] = mapped_column(ForeignKey("festival_editions.id"))
    edition: Mapped["FestivalEdition"] = relationship(back_populates="winner_categories", lazy="selectin")

    winners: Mapped[List["FestivalWinner"]] = relationship(back_populates="category", lazy="selectin")


class FestivalWinner(Base):
    __tablename__ = "festival_winners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    movie_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    movie_poster_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    recipient: Mapped[str | None] = mapped_column(String(100), nullable=True)
    director: Mapped[str | None] = mapped_column(String(100), nullable=True)
    citation: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    movie: Mapped["Movie | None"] = relationship(lazy="selectin")

    category_id: Mapped[int] = mapped_column(ForeignKey("festival_winner_categories.id"))
    category: Mapped["FestivalWinnerCategory"] = relationship(back_populates="winners", lazy="selectin")



# Visual Treats domain models
visual_treat_tags = Table(
    "visual_treat_tags",
    Base.metadata,
    Column("treat_id", ForeignKey("visual_treats.id"), primary_key=True),
    Column("tag_id", ForeignKey("visual_treat_tag_lookup.id"), primary_key=True),
)


class VisualTreatTagLookup(Base):
    __tablename__ = "visual_treat_tag_lookup"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)


class VisualTreat(Base):
    __tablename__ = "visual_treats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    category: Mapped[str] = mapped_column(String(80))
    director: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cinematographer: Mapped[str | None] = mapped_column(String(100), nullable=True)

    color_palette: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array of hex strings
    likes: Mapped[int] = mapped_column(Integer, default=0)
    views: Mapped[int] = mapped_column(Integer, default=0)

    aspect_ratio: Mapped[str | None] = mapped_column(String(20), nullable=True)
    resolution: Mapped[str | None] = mapped_column(String(50), nullable=True)
    submitted_by: Mapped[str | None] = mapped_column(String(100), nullable=True)

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    scene_id: Mapped[int | None] = mapped_column(ForeignKey("scenes.id"), nullable=True)

    movie: Mapped["Movie | None"] = relationship(lazy="selectin")
    scene: Mapped["Scene | None"] = relationship(lazy="selectin")

    tags: Mapped[List["VisualTreatTagLookup"]] = relationship(
        secondary=visual_treat_tags,
        lazy="selectin",
    )



# Pulse domain models
class UserFollow(Base):
    __tablename__ = "user_follows"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    follower_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    following_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Pulse(Base):
    __tablename__ = "pulses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(lazy="selectin")

    content_text: Mapped[str] = mapped_column(Text)
    content_media: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array of {type,url,thumbnailUrl}

    linked_type: Mapped[str | None] = mapped_column(String(20), nullable=True)  # movie | cricket
    linked_external_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    linked_title: Mapped[str | None] = mapped_column(String(200), nullable=True)
    linked_poster_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    linked_movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    linked_movie: Mapped["Movie | None"] = relationship(lazy="selectin")

    hashtags: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON array of strings

    reactions_json: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON object with reaction counts
    reactions_total: Mapped[int] = mapped_column(Integer, default=0)
    comments_count: Mapped[int] = mapped_column(Integer, default=0)
    shares_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    edited_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class TrendingTopic(Base):
    __tablename__ = "trending_topics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tag: Mapped[str] = mapped_column(String(120), index=True)
    category: Mapped[str | None] = mapped_column(String(20), nullable=True)  # movie | cricket | event | general
    window_label: Mapped[str] = mapped_column(String(10), default="7d")
    count: Mapped[int] = mapped_column(Integer, default=0)
    computed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)



# Quiz domain models
class Quiz(Base):
    __tablename__ = "quizzes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    number_of_questions: Mapped[int] = mapped_column(Integer, default=10)
    time_limit_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    pass_score: Mapped[int] = mapped_column(Integer, default=70)
    is_verification_required: Mapped[bool] = mapped_column(Boolean, default=True)
    is_randomized: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True, onupdate=datetime.utcnow)

    movie_id: Mapped[int | None] = mapped_column(ForeignKey("movies.id"), nullable=True)
    movie: Mapped["Movie | None"] = relationship(lazy="selectin")

    questions: Mapped[List["QuizQuestion"]] = relationship(back_populates="quiz", lazy="selectin", cascade="all, delete-orphan")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"))
    quiz: Mapped["Quiz"] = relationship(back_populates="questions", lazy="selectin")

    text: Mapped[str] = mapped_column(Text)
    media_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    media_type: Mapped[str | None] = mapped_column(String(20), nullable=True)  # image | video | audio
    hint: Mapped[str | None] = mapped_column(Text, nullable=True)
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)

    points: Mapped[int] = mapped_column(Integer, default=10)
    order_index: Mapped[int] = mapped_column(Integer, default=0)
    type: Mapped[str] = mapped_column(String(30), default="multiple-choice")  # multiple-choice | true-false | multiple-select

    options: Mapped[List["QuizQuestionOption"]] = relationship(back_populates="question", lazy="selectin", cascade="all, delete-orphan")


class QuizQuestionOption(Base):
    __tablename__ = "quiz_question_options"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    question_id: Mapped[int] = mapped_column(ForeignKey("quiz_questions.id"))
    question: Mapped["QuizQuestion"] = relationship(back_populates="options", lazy="selectin")

    text: Mapped[str] = mapped_column(Text)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    order_index: Mapped[int] = mapped_column(Integer, default=0)


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    attempt_number: Mapped[int] = mapped_column(Integer, default=1)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    time_spent_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)

    score_percent: Mapped[int] = mapped_column(Integer, default=0)
    passed: Mapped[bool] = mapped_column(Boolean, default=False)

    answers: Mapped[List["QuizAnswer"]] = relationship(back_populates="attempt", lazy="selectin", cascade="all, delete-orphan")


class QuizAnswer(Base):
    __tablename__ = "quiz_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    attempt_id: Mapped[int] = mapped_column(ForeignKey("quiz_attempts.id"))
    attempt: Mapped["QuizAttempt"] = relationship(back_populates="answers", lazy="selectin")

    question_id: Mapped[int] = mapped_column(ForeignKey("quiz_questions.id"))
    question: Mapped["QuizQuestion"] = relationship(lazy="selectin")

    selected_option_ids: Mapped[str] = mapped_column(Text)  # JSON array of option external_ids
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    time_spent_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)


class QuizLeaderboardEntry(Base):
    __tablename__ = "quiz_leaderboard_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    quiz_id: Mapped[int] = mapped_column(ForeignKey("quizzes.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    score_percent: Mapped[int] = mapped_column(Integer)
    completion_time_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)



# Talent Hub domain models
from sqlalchemy.dialects.postgresql import JSONB

class CastingCall(Base):
    __tablename__ = "casting_calls"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    project_title: Mapped[str] = mapped_column(String(200))
    project_type: Mapped[str] = mapped_column(String(30), index=True)  # feature | short | tv-series | web-series | commercial | documentary
    production_company: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)

    production_start: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    production_end: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    location_city: Mapped[str] = mapped_column(String(120))
    location_state: Mapped[str | None] = mapped_column(String(120), nullable=True)
    location_country: Mapped[str] = mapped_column(String(120), index=True)

    budget_range: Mapped[str | None] = mapped_column(String(20), nullable=True)  # low | medium | high | undisclosed
    visibility: Mapped[str] = mapped_column(String(20), default="public", index=True)  # public | private

    submission_deadline: Mapped[datetime] = mapped_column(DateTime)
    posted_date: Mapped[datetime] = mapped_column(DateTime, index=True)

    poster_image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)  # active | closed | draft

    roles: Mapped[List["CastingCallRole"]] = relationship(back_populates="call", lazy="selectin", cascade="all, delete-orphan")
    guidelines: Mapped[SubmissionGuidelines | None] = relationship(back_populates="call", lazy="selectin", uselist=False, cascade="all, delete-orphan")


class CastingCallRole(Base):
    __tablename__ = "casting_call_roles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    call_id: Mapped[int] = mapped_column(ForeignKey("casting_calls.id", ondelete="CASCADE"))
    call: Mapped["CastingCall"] = relationship(back_populates="roles", lazy="selectin")

    type: Mapped[str] = mapped_column(String(20), index=True)  # acting | crew
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(50))
    department: Mapped[str | None] = mapped_column(String(80), nullable=True)

    compensation: Mapped[str] = mapped_column(String(20))  # paid | unpaid | deferred | credit-only
    payment_details: Mapped[str | None] = mapped_column(Text, nullable=True)

    requirements: Mapped[dict | None] = mapped_column(JSONB, nullable=True)  # JSON: ageRange, gender, ethnicity, languages, skills, experienceLevel, unionStatus, physicalAttributes
    audition_type: Mapped[str] = mapped_column(String(20))  # in-person | self-tape | video-call


class SubmissionGuidelines(Base):
    __tablename__ = "submission_guidelines"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    call_id: Mapped[int] = mapped_column(ForeignKey("casting_calls.id", ondelete="CASCADE"), unique=True)
    call: Mapped["CastingCall"] = relationship(back_populates="guidelines", lazy="selectin")

    required_materials: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    submission_method: Mapped[str] = mapped_column(String(20))  # siddu | email | website
    contact_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    contact_website: Mapped[str | None] = mapped_column(String(200), nullable=True)
    special_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)


# --- Admin domain models ---
from sqlalchemy.dialects.postgresql import JSONB as _JSONB

class AdminUserMeta(Base):
    __tablename__ = "admin_user_meta"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    email: Mapped[str] = mapped_column(String(200), index=True)
    roles: Mapped[list] = mapped_column(_JSONB, default=list)  # ["User", "Admin", ...]
    status: Mapped[str] = mapped_column(String(20), default="Active", index=True)

    joined_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    profile_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    verification_status: Mapped[str | None] = mapped_column(String(20), nullable=True)
    account_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    phone_number: Mapped[str | None] = mapped_column(String(40), nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)

    user: Mapped["User"] = relationship(lazy="selectin")


class ModerationItem(Base):
    __tablename__ = "moderation_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    content_type: Mapped[str] = mapped_column(String(20), index=True)  # review | comment | pulse
    content_title: Mapped[str] = mapped_column(String(255))
    report_reason: Mapped[str | None] = mapped_column(String(120), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending", index=True)  # pending | flagged | resolved
    reporter_count: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    content_ref: Mapped[str | None] = mapped_column(String(80), nullable=True)  # external id of review/comment/pulse

    actions: Mapped[List["ModerationAction"]] = relationship(back_populates="item", lazy="selectin", cascade="all, delete-orphan")


class ModerationAction(Base):
    __tablename__ = "moderation_actions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    item_id: Mapped[int] = mapped_column(ForeignKey("moderation_items.id", ondelete="CASCADE"), index=True)
    moderator_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)

    action: Mapped[str] = mapped_column(String(20))  # approve | reject | escalate
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    item: Mapped["ModerationItem"] = relationship(back_populates="actions", lazy="selectin")


class SystemSettings(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(40), unique=True, index=True, default="default")
    data: Mapped[dict] = mapped_column(_JSONB, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AdminMetricSnapshot(Base):
    __tablename__ = "admin_metric_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    snapshot_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    metrics: Mapped[dict] = mapped_column(_JSONB, default=dict)



# --- Notifications domain models ---
class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    external_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    type: Mapped[str] = mapped_column(String(20), index=True)  # social | release | system | club | quiz
    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    action_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    meta: Mapped[dict | None] = mapped_column("metadata", _JSONB, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    user: Mapped["User"] = relationship(lazy="selectin")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    channels: Mapped[dict] = mapped_column(_JSONB, default=dict)  # per-category: { social: {inApp,email,push}, ... }
    global_settings: Mapped[dict] = mapped_column(_JSONB, default=dict)  # {emailFrequency, pushEnabled, ...}
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship(lazy="selectin")



# --- Settings domain models ---
class UserSettings(Base):
    __tablename__ = "user_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)

    account: Mapped[dict] = mapped_column(_JSONB, default=dict)       # name, email, phone, avatar, bio, etc.
    profile: Mapped[dict] = mapped_column(_JSONB, default=dict)       # username, fullName, avatarUrl, bio
    privacy: Mapped[dict] = mapped_column(_JSONB, default=dict)       # profileVisibility, activitySharing, messageRequests, dataDownloadRequested
    display: Mapped[dict] = mapped_column(_JSONB, default=dict)       # theme, fontSize, highContrastMode, reduceMotion
    preferences: Mapped[dict] = mapped_column(_JSONB, default=dict)   # language, region, hideSpoilers, excludedGenres, contentRating
    security: Mapped[dict] = mapped_column(_JSONB, default=dict)      # twoFactorEnabled, loginNotifications
    integrations: Mapped[dict] = mapped_column(_JSONB, default=dict)  # connected apps statuses
    data: Mapped[dict] = mapped_column(_JSONB, default=dict)          # data export/deletion requests

    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship(lazy="selectin")
