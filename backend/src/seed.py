from __future__ import annotations

import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

try:
    from . import db as dbmod
    from .models import (
        Genre,
        Movie,
        Person,
        User,
        Review,
        Collection,
        Watchlist,
        Favorite,
        AwardCeremony,
        AwardCeremonyYear,
        AwardCategory,
        AwardNomination,
        BoxOfficeWeekendEntry,
        BoxOfficeTrendPoint,
        BoxOfficeYTD,
        BoxOfficeYTDTopMovie,
        BoxOfficeRecord,
        BoxOfficePerformanceGenre,
        BoxOfficePerformanceStudio,
        BoxOfficePerformanceMonthly,
        Scene,
        Festival,
        FestivalEdition,
        FestivalProgramSection,
        FestivalProgramEntry,
        FestivalWinnerCategory,
        FestivalWinner,
        VisualTreat,
        VisualTreatTagLookup,
    )
    from .config import settings
    from .security.password import hash_password
except ImportError:
    import db as dbmod  # type: ignore
    from models import Genre, Movie  # type: ignore
    from config import settings  # type: ignore


async def seed() -> None:
    # ensure DB engine/session initialized
    print(f"[seed] settings.database_url={settings.database_url}")
    await dbmod.init_db()
    if dbmod.SessionLocal is None:
        print("SessionLocal is None; set DATABASE_URL in apps/backend/.env and restart.")
        return

    async with dbmod.SessionLocal() as session:  # type: AsyncSession
        # Upsert a few genres
        genres = [
            {"slug": "sci-fi", "name": "Sci‑Fi"},
            {"slug": "drama", "name": "Drama"},
            {"slug": "comedy", "name": "Comedy"},
        ]
        existing = (await session.execute(select(Genre))).scalars().all()
        by_slug = {g.slug: g for g in existing}

        for g in genres:
            if g["slug"] not in by_slug:
                session.add(Genre(slug=g["slug"], name=g["name"]))

        await session.flush()

        # Ensure at least a few movies for sci-fi
        sci = (await session.execute(select(Genre).where(Genre.slug == "sci-fi"))).scalar_one()
        movie_specs = [
            {"external_id": "tt0083658", "title": "Blade Runner", "year": "1982"},
            {"external_id": "tt1375666", "title": "Inception", "year": "2010"},
            {"external_id": "tt0133093", "title": "The Matrix", "year": "1999"},
        ]
        existing_movies = (await session.execute(select(Movie))).scalars().all()
        by_ext = {m.external_id: m for m in existing_movies}

        for spec in movie_specs:
            m = by_ext.get(spec["external_id"]) or Movie(**spec)
            if m not in existing_movies:
                session.add(m)
            if sci not in m.genres:
                m.genres.append(sci)

        await session.commit()
        # Upsert a couple of people and link to movies
        from sqlalchemy import select as _select
        existing_people = (await session.execute(_select(Person))).scalars().all()
        by_pid = {p.external_id: p for p in existing_people}
        people_specs = [
            {"external_id": "nm0000206", "name": "Keanu Reeves"},
            {"external_id": "nm0634240", "name": "Christopher Nolan"},
        ]
        for spec in people_specs:
            if spec["external_id"] not in by_pid:
                session.add(Person(**spec))
        await session.flush()
        # Link Keanu to The Matrix; Nolan to Inception
        m_matrix = (await session.execute(_select(Movie).where(Movie.external_id=="tt0133093"))).scalar_one_or_none()
        m_inception = (await session.execute(_select(Movie).where(Movie.external_id=="tt1375666"))).scalar_one_or_none()
        p_keanu = (await session.execute(_select(Person).where(Person.external_id=="nm0000206"))).scalar_one_or_none()
        p_nolan = (await session.execute(_select(Person).where(Person.external_id=="nm0634240"))).scalar_one_or_none()
        if m_matrix and p_keanu and p_keanu not in m_matrix.people:
            m_matrix.people.append(p_keanu)
        if m_inception and p_nolan and p_nolan not in m_inception.people:
            m_inception.people.append(p_nolan)
        await session.commit()

        # Upsert users and reviews
        from datetime import datetime
        existing_users = (await session.execute(_select(User))).scalars().all()
        by_uid = {u.external_id: u for u in existing_users}
        user_specs = [
            {
                "external_id": "user-1",
                "name": "CinemaEnthusiast",
                "email": "user1@example.com",
                "hashed_password": hash_password("password123"),
            },
            {
                "external_id": "user-2",
                "name": "FilmCritic101",
                "email": "user2@example.com",
                "hashed_password": hash_password("password123"),
            },
        ]
        for spec in user_specs:
            if spec["external_id"] not in by_uid:
                session.add(User(**spec))
        await session.flush()

        # Create reviews for Matrix and Inception
        existing_reviews = (await session.execute(_select(Review))).scalars().all()
        by_rid = {rv.external_id: rv for rv in existing_reviews}
        u1 = (await session.execute(_select(User).where(User.external_id=="user-1"))).scalar_one_or_none()
        u2 = (await session.execute(_select(User).where(User.external_id=="user-2"))).scalar_one_or_none()
        if m_matrix and u1 and "review-1" not in by_rid:
            session.add(Review(
                external_id="review-1",
                title="A Masterpiece of Dreams Within Dreams",
                content="Inception is a mind-bending thriller that challenges the audience...",
                rating=9.5,
                date=datetime(2023, 12, 15, 14, 30),
                has_spoilers=False,
                is_verified=True,
                helpful_votes=342,
                unhelpful_votes=18,
                comment_count=57,
                engagement_score=85,
                user_id=u1.id,
                movie_id=m_matrix.id,
            ))
        if m_inception and u2 and "review-2" not in by_rid:
            session.add(Review(
                external_id="review-2",
                title="Nolan's Best Work",
                content="Christopher Nolan delivers a visually stunning and intellectually engaging film...",
                rating=9.8,
                date=datetime(2023, 11, 20, 9, 15),
                has_spoilers=True,
                is_verified=True,
                helpful_votes=289,
                unhelpful_votes=12,
                comment_count=43,
                engagement_score=92,
                user_id=u2.id,
                movie_id=m_inception.id,
            ))
        await session.commit()

        # Upsert collections
        existing_collections = (await session.execute(_select(Collection))).scalars().all()
        by_cid = {col.external_id: col for col in existing_collections}
        if u1 and "featured-1" not in by_cid:
            col1 = Collection(
                external_id="featured-1",
                title="Nolan's Mind-Bending Masterpieces",
                description="A curated collection of Christopher Nolan's most cerebral and visually stunning films.",
                is_public=True,
                followers=12500,
                tags="nolan,sci-fi,thriller",
                user_id=u1.id,
            )
            session.add(col1)
            await session.flush()
            # Refresh to load relationships
            await session.refresh(col1, ["movies"])
            if m_inception and m_inception not in col1.movies:
                col1.movies.append(m_inception)
            if m_matrix and m_matrix not in col1.movies:
                col1.movies.append(m_matrix)
        await session.commit()

        # Upsert watchlist and favorites
        existing_watchlist = (await session.execute(_select(Watchlist))).scalars().all()
        by_wid = {w.external_id: w for w in existing_watchlist}
        if u1 and m_inception and "watchlist-1" not in by_wid:
            session.add(Watchlist(
                external_id="watchlist-1",
                date_added=datetime(2023, 12, 15),
                status="want-to-watch",
                priority="high",
                progress=0,
                user_id=u1.id,
                movie_id=m_inception.id,
            ))
        existing_favorites = (await session.execute(_select(Favorite))).scalars().all()
        by_fid = {fav.external_id: fav for fav in existing_favorites}
        if u1 and m_matrix and "favorite-1" not in by_fid:
            session.add(Favorite(
                external_id="favorite-1",
                type="movie",
                added_date=datetime(2023, 11, 20),
                user_id=u1.id,
                movie_id=m_matrix.id,
            ))
        if u2 and p_nolan and "favorite-2" not in by_fid:
            session.add(Favorite(
                external_id="favorite-2",
                type="person",
                added_date=datetime(2023, 10, 5),
                user_id=u2.id,
                person_id=p_nolan.id,
            ))
        await session.commit()
        # Upsert awards (ceremonies, years, categories, nominations)
        existing_ceremonies = (await session.execute(_select(AwardCeremony))).scalars().all()
        by_acid = {c.external_id: c for c in existing_ceremonies}
        if "oscars" not in by_acid:
            osc = AwardCeremony(
                external_id="oscars",
                name="Academy Awards",
                short_name="Oscars",
                description="The most prestigious awards in filmmaking",
                logo_url="/oscar-trophy.png",
                background_image_url="/oscar-ceremony-stage.png",
                current_year=2024,
            )
            session.add(osc)
            await session.flush()
        else:
            osc = by_acid["oscars"]

        # Years
        existing_years = (await session.execute(_select(AwardCeremonyYear))).scalars().all()
        by_yr = {y.external_id: y for y in existing_years}
        def ensure_year(ext_id: str, year_val: int) -> AwardCeremonyYear:
            if ext_id in by_yr:
                return by_yr[ext_id]
            y = AwardCeremonyYear(
                external_id=ext_id,
                year=year_val,
                date=datetime(year_val, 3, 10),
                location="Dolby Theatre, Los Angeles",
                hosted_by="Jimmy Kimmel",
                background_image_url="/oscar-ceremony-stage.png",
                logo_url="/oscar-trophy.png",
                description=f"Celebrating the best films of {year_val-1}.",
                ceremony_id=osc.id,
            )
            session.add(y)
            return y

        y2024 = ensure_year("oscars-2024", 2024)
        y2023 = ensure_year("oscars-2023", 2023)
        await session.flush()

        # Categories for 2024
        existing_categories = (await session.execute(_select(AwardCategory))).scalars().all()
        by_cat = {c.external_id: c for c in existing_categories}
        def ensure_category(ext_id: str, name: str, year_obj: AwardCeremonyYear) -> AwardCategory:
            if ext_id in by_cat:
                return by_cat[ext_id]
            c = AwardCategory(external_id=ext_id, name=name, ceremony_year_id=year_obj.id)
            session.add(c)
            by_cat[ext_id] = c
            return c

        cat_bp_2024 = ensure_category("oscars-2024-best-picture", "Best Picture", y2024)
        cat_ba_2024 = ensure_category("oscars-2024-best-actress", "Best Actress", y2024)
        await session.flush()

        # Nominations (use existing movies/people)
        existing_noms = (await session.execute(_select(AwardNomination))).scalars().all()
        by_nid = {n.external_id: n for n in existing_noms}

        def ensure_nom(
            ext_id: str,
            category: AwardCategory,
            nominee_type: str,
            nominee_name: str,
            *,
            movie_id: int | None = None,
            person_id: int | None = None,
            is_winner: bool = False,
        ) -> None:
            if ext_id in by_nid:
                return
            n = AwardNomination(
                external_id=ext_id,
                nominee_type=nominee_type,
                nominee_name=nominee_name,
                is_winner=is_winner,
                category_id=category.id,
                movie_id=movie_id,
                person_id=person_id,
            )
            session.add(n)
            by_nid[ext_id] = n

        if m_inception:
            ensure_nom("oscars-2024-bp-inception", cat_bp_2024, "movie", "Inception", movie_id=m_inception.id, is_winner=True)
        if m_matrix:
            ensure_nom("oscars-2024-bp-matrix", cat_bp_2024, "movie", "The Matrix", movie_id=m_matrix.id)
        if p_nolan:
            ensure_nom("oscars-2024-ba-stone", cat_ba_2024, "person", "Emma Stone", person_id=None, is_winner=True)
            ensure_nom("oscars-2024-ba-gladstone", cat_ba_2024, "person", "Lily Gladstone", person_id=None)

        await session.commit()

        # Box Office seed (global)
        existing_we = (await session.execute(_select(BoxOfficeWeekendEntry))).scalars().all()
        if not existing_we:
            if m_inception:
                session.add(
                    BoxOfficeWeekendEntry(
                        region="global",
                        rank=1,
                        movie_id=m_inception.id,
                        weekend_gross_usd=82_400_000,
                        total_gross_usd=174_200_000,
                        change_percent=15.2,
                        is_positive=True,
                        weeks_in_release=2,
                    )
                )
            if m_matrix:
                session.add(
                    BoxOfficeWeekendEntry(
                        region="global",
                        rank=2,
                        movie_id=m_matrix.id,
                        weekend_gross_usd=54_200_000,
                        total_gross_usd=126_300_000,
                        change_percent=12.4,
                        is_positive=False,
                        weeks_in_release=3,
                    )
                )
        existing_tr = (await session.execute(_select(BoxOfficeTrendPoint))).scalars().all()
        if not existing_tr:
            from datetime import datetime as _dt

            for d, g in [
                ("2024-07-01", 145.2),
                ("2024-07-08", 167.8),
                ("2024-07-15", 189.4),
                ("2024-07-22", 234.7),
                ("2024-07-29", 198.3),
                ("2024-08-05", 176.9),
                ("2024-08-12", 203.1),
            ]:
                session.add(
                    BoxOfficeTrendPoint(region="global", date=_dt.fromisoformat(d), gross_millions_usd=g)
                )
        existing_ytd = (
            await session.execute(
                _select(BoxOfficeYTD).where(BoxOfficeYTD.region == "global", BoxOfficeYTD.year == 2023)
            )
        ).scalars().first()
        if not existing_ytd:
            y = BoxOfficeYTD(
                region="global",
                year=2023,
                total_gross_usd=4_870_000_000,
                change_percent=12.4,
                is_positive=True,
                previous_year=2022,
                previous_total_gross_usd=4_330_000_000,
            )
            session.add(y)
            await session.flush()
            for title, amount in [
                ("Guardians of the Galaxy Vol. 3", 358_900_000),
                ("Spider-Man: Across the Spider-Verse", 381_400_000),
                ("The Little Mermaid", 298_200_000),
                ("Fast X", 146_100_000),
            ]:
                session.add(BoxOfficeYTDTopMovie(ytd_id=y.id, title=title, gross_usd=amount))
        existing_rec = (await session.execute(_select(BoxOfficeRecord))).scalars().all()
        if not existing_rec:
            session.add_all(
                [
                    BoxOfficeRecord(
                        region="global",
                        category="Highest Grossing All-Time",
                        title="Avatar",
                        value_text="$2.92B",
                        year="2009",
                        poster_url="/avatar-poster.png",
                    ),
                    BoxOfficeRecord(
                        region="global",
                        category="Biggest Opening Weekend",
                        title="Avengers: Endgame",
                        value_text="$357.1M",
                        year="2019",
                        poster_url="/action-movie-poster.png",
                    ),
                    BoxOfficeRecord(
                        region="global",
                        category="Fastest to $1 Billion",
                        title="Spider-Man: No Way Home",
                        value_text="12 days",
                        year="2021",
                        poster_url="/animated-movie-poster.png",
                    ),
                    BoxOfficeRecord(
                        region="global",
                        category="Highest International Gross",
                        title="Avatar: The Way of Water",
                        value_text="$1.73B",
                        year="2022",
                        poster_url="/avatar-poster.png",
                    ),
                ]
            )
        existing_pg = (await session.execute(_select(BoxOfficePerformanceGenre))).scalars().all()
        if not existing_pg:
            session.add_all(
                [
                    BoxOfficePerformanceGenre(region="global", name="Action", percent=35, color="#00BFFF"),
                    BoxOfficePerformanceGenre(region="global", name="Drama", percent=22, color="#FF6B6B"),
                    BoxOfficePerformanceGenre(region="global", name="Comedy", percent=18, color="#4ECDC4"),
                    BoxOfficePerformanceGenre(region="global", name="Sci-Fi", percent=15, color="#45B7D1"),
                    BoxOfficePerformanceGenre(region="global", name="Horror", percent=10, color="#96CEB4"),
                ]
            )
        existing_ps = (await session.execute(_select(BoxOfficePerformanceStudio))).scalars().all()
        if not existing_ps:
            session.add_all(
                [
                    BoxOfficePerformanceStudio(region="global", studio="Disney", gross_millions_usd=1240),
                    BoxOfficePerformanceStudio(region="global", studio="Warner Bros", gross_millions_usd=980),
                    BoxOfficePerformanceStudio(region="global", studio="Universal", gross_millions_usd=850),
                    BoxOfficePerformanceStudio(region="global", studio="Sony", gross_millions_usd=720),
                    BoxOfficePerformanceStudio(region="global", studio="Paramount", gross_millions_usd=650),
                    BoxOfficePerformanceStudio(region="global", studio="20th Century", gross_millions_usd=480),
                ]
            )
        existing_pm = (await session.execute(_select(BoxOfficePerformanceMonthly))).scalars().all()
        if not existing_pm:
            session.add_all(
                [
                    BoxOfficePerformanceMonthly(region="global", month="Jan", gross_millions_usd=890),
                    BoxOfficePerformanceMonthly(region="global", month="Feb", gross_millions_usd=750),
                    BoxOfficePerformanceMonthly(region="global", month="Mar", gross_millions_usd=1200),
                    BoxOfficePerformanceMonthly(region="global", month="Apr", gross_millions_usd=980),
                    BoxOfficePerformanceMonthly(region="global", month="May", gross_millions_usd=1450),
                    BoxOfficePerformanceMonthly(region="global", month="Jun", gross_millions_usd=1680),
                    BoxOfficePerformanceMonthly(region="global", month="Jul", gross_millions_usd=1890),
                ]
            )
        await session.commit()

        # Festivals seed
        existing_fests = (await session.execute(_select(Festival))).scalars().all()
        by_f = {f.external_id: f for f in existing_fests}
        def ensure_festival(ext_id: str, name: str, **kwargs) -> Festival:
            if ext_id in by_f:
                return by_f[ext_id]
            f = Festival(external_id=ext_id, name=name, **kwargs)
            session.add(f)
            by_f[ext_id] = f
            return f

        cannes = ensure_festival(
            "cannes",
            "Cannes Film Festival",
            location="Cannes, France",
            description="The most prestigious film festival in the world, showcasing the best in international cinema",
            website="festival-cannes.com",
            image_url="/cannes-festival.png",
            logo_url="/cannes-logo.png",
            founding_year=1946,
        )
        venice = ensure_festival(
            "venice",
            "Venice Film Festival",
            location="Venice, Italy",
            description="The oldest film festival in the world",
            website="labiennale.org/en/cinema",
            image_url="/venice-festival.png",
            logo_url=None,
            founding_year=1932,
        )
        sundance = ensure_festival(
            "sundance",
            "Sundance Film Festival",
            location="Park City, USA",
            description="Premier showcase for independent cinema",
            website="festival.sundance.org",
            image_url="/sundance-festival.png",
            logo_url=None,
            founding_year=1978,
        )
        await session.flush()

        # Cannes 2024 edition, program, winners
        ed_existing = (await session.execute(_select(FestivalEdition).where(FestivalEdition.external_id=="cannes-2024"))).scalars().first()
        if not ed_existing:
            ed = FestivalEdition(
                external_id="cannes-2024",
                year=2024,
                edition_label="77th",
                dates="May 14-25, 2024",
                status="upcoming",
                festival_id=cannes.id,
            )
            session.add(ed)
            await session.flush()
            # Program sections
            sec_comp = FestivalProgramSection(name="competition", edition_id=ed.id)
            sec_ooc = FestivalProgramSection(name="outOfCompetition", edition_id=ed.id)
            sec_spec = FestivalProgramSection(name="specialScreenings", edition_id=ed.id)
            session.add_all([sec_comp, sec_ooc, sec_spec])
            await session.flush()
            session.add_all([
                FestivalProgramEntry(section_id=sec_comp.id, title="The Zone of Interest", director="Jonathan Glazer", country="UK/Poland", premiere="World Premiere", image_url="/zone-of-interest.png"),
                FestivalProgramEntry(section_id=sec_comp.id, title="Anatomy of a Fall", director="Justine Triet", country="France", premiere="World Premiere", image_url="/anatomy-of-fall.png"),
                FestivalProgramEntry(section_id=sec_ooc.id, title="Indiana Jones 5", director="James Mangold", country="USA", premiere="Out of Competition", image_url="/indiana-jones-5.png"),
                FestivalProgramEntry(section_id=sec_spec.id, title="Killers of the Flower Moon", director="Martin Scorsese", country="USA", premiere="Special Screening", image_url="/killers-flower-moon.png"),
            ])
            # Winners (examples)
            cat_palme = FestivalWinnerCategory(external_id="palme-dor", name="Palme d'Or", edition_id=ed.id)
            cat_gp = FestivalWinnerCategory(external_id="grand-prix", name="Grand Prix", edition_id=ed.id)
            session.add_all([cat_palme, cat_gp])
            await session.flush()
            session.add_all([
                FestivalWinner(category_id=cat_palme.id, movie_title="Anatomy of a Fall", movie_poster_url="/placeholder.svg?height=400&width=300", recipient="Justine Triet", director="Justine Triet", citation="For its masterful exploration of truth and perception in relationships", rating=8.2),
                FestivalWinner(category_id=cat_gp.id, movie_title="The Zone of Interest", movie_poster_url="/placeholder.svg?height=400&width=300", recipient="Jonathan Glazer", director="Jonathan Glazer", citation="For its haunting portrayal of the banality of evil", rating=8.1),
            ])
        await session.commit()

        # Scenes seed (Scene Explorer)
        # Ensure some scenes for Inception and The Matrix
        from sqlalchemy import select as _select  # local alias if not present
        inception = (await session.execute(_select(Movie).where(Movie.external_id=="tt1375666"))).scalar_one_or_none()
        matrix = (await session.execute(_select(Movie).where(Movie.external_id=="tt0133093"))).scalar_one_or_none()
        sci_genre = (await session.execute(_select(Genre).where(Genre.slug=="sci-fi"))).scalar_one_or_none()

        existing_scenes = (await session.execute(_select(Scene))).scalars().all()
        by_sid = {s.external_id: s for s in existing_scenes}

        def ensure_scene(**kwargs) -> Scene:
            ext_id = kwargs["external_id"]
            if ext_id in by_sid:
                return by_sid[ext_id]
            s = Scene(**kwargs)
            session.add(s)
            by_sid[ext_id] = s
            return s

        if inception:
            s1 = ensure_scene(
                external_id="scene-tt1375666-001",
                title="Dream Collapse",
                description="The iconic scene where the dream world begins to fold and collapse.",
                thumbnail_url="/placeholder.svg?height=720&width=1280&query=city%20folding%20inception%20scene",
                duration_str="2:45",
                scene_type="vfx",
                director="Christopher Nolan",
                cinematographer="Wally Pfister",
                view_count=24853,
                comment_count=342,
                is_popular=True,
                is_visual_treat=True,
                movie_id=inception.id,
            )
            if sci_genre and sci_genre not in s1.genres:
                s1.genres.append(sci_genre)

            s2 = ensure_scene(
                external_id="scene-tt1375666-002",
                title="Hallway Fight",
                description="A gravity-defying fight sequence in a rotating hotel hallway.",
                thumbnail_url="/placeholder.svg?height=720&width=1280&query=rotating%20hallway%20fight%20scene",
                duration_str="3:20",
                scene_type="action",
                director="Christopher Nolan",
                cinematographer="Wally Pfister",
                view_count=18742,
                comment_count=256,
                is_popular=True,
                is_visual_treat=True,
                movie_id=inception.id,
            )
            if sci_genre and sci_genre not in s2.genres:
                s2.genres.append(sci_genre)

        if matrix:
            s3 = ensure_scene(
                external_id="scene-tt0133093-001",
                title="Bullet Time",
                description="Neo dodges bullets in slow motion, bending the rules of reality.",
                thumbnail_url="/placeholder.svg?height=720&width=1280&query=matrix%20bullet%20time%20scene",
                duration_str="2:10",
                scene_type="vfx",
                director="The Wachowskis",
                cinematographer="Bill Pope",
                view_count=22110,
                comment_count=301,
                is_popular=True,
                is_visual_treat=True,
                movie_id=matrix.id,
            )
            if sci_genre and sci_genre not in s3.genres:
                s3.genres.append(sci_genre)

        await session.commit()

        # Visual Treats seed
        from sqlalchemy import select as _select, insert as _insert, and_ as _and  # ensure alias
        import json as _json
        from .models import visual_treat_tags


        vt_existing = (await session.execute(_select(VisualTreat))).scalars().all()
        vt_by_ext = {v.external_id: v for v in vt_existing}

        def ensure_vt(**kwargs) -> tuple[VisualTreat, bool]:
            ext = kwargs["external_id"]
            if ext in vt_by_ext:
                return vt_by_ext[ext], False
            v = VisualTreat(**kwargs)
            session.add(v)
            vt_by_ext[ext] = v
            return v, True

        if inception:
            vt1, _is_new1 = ensure_vt(
                external_id="vt-tt1375666-001",
                title="The Spinning Top",
                description="Iconic final shot of Inception.",
                image_url="/inception-spinning-top.png",
                category="Symbolism",
                director="Christopher Nolan",
                cinematographer="Wally Pfister",
                color_palette=_json.dumps(["#1a1a1a", "#4a4a4a", "#8b7355", "#d4af37", "#f5f5dc"]),
                likes=2847,
                views=45632,
                aspect_ratio="2.39:1",
                resolution="4K",
                movie_id=inception.id,
            )
            if _is_new1:
                await session.flush()
                for name in ["dreams", "reality", "ambiguity", "cliffhanger", "nolan"]:
                    _existing = (await session.execute(_select(VisualTreatTagLookup).where(VisualTreatTagLookup.name==name))).scalar_one_or_none()
                    tag = _existing or VisualTreatTagLookup(name=name)
                    if _existing is None:
                        session.add(tag)
                        await session.flush()
                    assoc = (await session.execute(
                        _select(visual_treat_tags.c.treat_id).where(
                            _and(
                                visual_treat_tags.c.treat_id==vt1.id,
                                visual_treat_tags.c.tag_id==tag.id,
                            )
                        )
                    )).first()
                    if assoc is None:
                        await session.execute(_insert(visual_treat_tags).values(treat_id=vt1.id, tag_id=tag.id))

        if matrix:
            vt2, _is_new2 = ensure_vt(
                external_id="vt-tt0133093-001",
                title="Bullet Time Aesthetic",
                description="Neo's bullet-time visual masterclass.",
                image_url="/matrix-bullet-time.png",
                category="Visual Effects",
                director="The Wachowskis",
                cinematographer="Bill Pope",
                color_palette=_json.dumps(["#001219", "#005f73", "#0a9396", "#94d2bd", "#e9d8a6"]),
                likes=3300,
                views=72098,
                aspect_ratio="2.20:1",
                resolution="4K",
                movie_id=matrix.id,
            )
            if _is_new2:
                await session.flush()
                for name in ["sci-fi", "classic", "psychedelic", "space"]:
                    _existing = (await session.execute(_select(VisualTreatTagLookup).where(VisualTreatTagLookup.name==name))).scalar_one_or_none()
                    tag = _existing or VisualTreatTagLookup(name=name)
                    if _existing is None:
                        session.add(tag)
                        await session.flush()
                    assoc = (await session.execute(
                        _select(visual_treat_tags.c.treat_id).where(
                            _and(
                                visual_treat_tags.c.treat_id==vt2.id,
                                visual_treat_tags.c.tag_id==tag.id,
                            )
                        )
                    )).first()
                    if assoc is None:
                        await session.execute(_insert(visual_treat_tags).values(treat_id=vt2.id, tag_id=tag.id))

        # --- Pulse domain seed ---
        from sqlalchemy import select as _select
        import json as _json
        from .models import Pulse, UserFollow

        # Ensure a few users exist for pulse posts
        existing_users = (await session.execute(_select(User))).scalars().all()
        by_uid = {u.external_id: u for u in existing_users}
        for spec in [
            {"external_id": "user-3", "name": "Cricket Enthusiast"},
            {"external_id": "user-4", "name": "Aspiring Filmmaker"},
        ]:
            if spec["external_id"] not in by_uid:
                session.add(User(**spec))
        await session.flush()

        u1 = (await session.execute(_select(User).where(User.external_id=="user-1"))).scalar_one_or_none()
        u2 = (await session.execute(_select(User).where(User.external_id=="user-2"))).scalar_one_or_none()
        u3 = (await session.execute(_select(User).where(User.external_id=="user-3"))).scalar_one_or_none()
        u4 = (await session.execute(_select(User).where(User.external_id=="user-4"))).scalar_one_or_none()

        # Simple follow graph: user-1 follows user-2 and user-4
        if u1 and u2:
            session.add(UserFollow(follower_id=u1.id, following_id=u2.id))
        if u1 and u4:
            session.add(UserFollow(follower_id=u1.id, following_id=u4.id))

        # Link movies for pulses
        inception = (await session.execute(_select(Movie).where(Movie.external_id=="tt1375666"))).scalar_one_or_none()
        matrix = (await session.execute(_select(Movie).where(Movie.external_id=="tt0133093"))).scalar_one_or_none()

        # Upsert helper
        existing_pulses = (await session.execute(_select(Pulse))).scalars().all()
        by_pid = {p.external_id: p for p in existing_pulses}
        def ensure_pulse(**kwargs) -> Pulse:
            ext = kwargs["external_id"]
            if ext in by_pid:
                return by_pid[ext]
            p = Pulse(**kwargs)
            session.add(p)
            by_pid[ext] = p
            return p

        # Pulse 1: Film announcement (user-2) linked to Inception as example
        if u2 and inception:
            ensure_pulse(
                external_id="pulse-1",
                user_id=u2.id,
                content_text=(
                    "Excited to announce that Oppenheimer will be available for streaming next month. "
                    "It's been an incredible journey bringing this story to life."
                ),
                content_media=None,
                linked_type="movie",
                linked_external_id=inception.external_id,
                linked_title=inception.title,
                linked_poster_url=inception.poster_url,
                linked_movie_id=inception.id,
                hashtags=_json.dumps(["#Oppenheimer", "#FilmAnnouncement"]),
                reactions_json=_json.dumps({"love": 8542, "fire": 3201, "mindblown": 4562, "laugh": 1203, "sad": 89, "angry": 12}),
                reactions_total=17609,
                comments_count=2453,
                shares_count=1876,
            )

        # Pulse 2: Study cinematography (user-4)
        if u4:
            ensure_pulse(
                external_id="pulse-2",
                user_id=u4.id,
                content_text=(
                    "Studying the cinematography techniques in 'Dune: Part Two'. The use of scale and perspective is impressive."
                ),
                content_media=_json.dumps([
                    {"type": "image", "url": "/dune-part-two-poster.png"},
                    {"type": "image", "url": "/cinematic-scene.png"},
                ]),
                linked_type=None,
                linked_external_id=None,
                linked_title=None,
                linked_poster_url=None,
                linked_movie_id=None,
                hashtags=_json.dumps(["#Dune2", "#Cinematography", "#FilmStudy"]),
                reactions_json=_json.dumps({"love": 543, "fire": 321, "mindblown": 432, "laugh": 87, "sad": 12, "angry": 3}),
                reactions_total=1398,
                comments_count=98,
                shares_count=54,
            )

        await session.commit()
        # --- Quiz domain seed ---
        from sqlalchemy import select as _select
        from .models import Quiz, QuizQuestion, QuizQuestionOption, QuizAttempt, QuizAnswer, QuizLeaderboardEntry
        import json as _json

        # Ensure quizzes for Inception and Interstellar
        q_existing = (await session.execute(_select(Quiz))).scalars().all()
        q_by_ext = {q.external_id: q for q in q_existing}

        def ensure_quiz(**kwargs) -> Quiz:
            ext = kwargs["external_id"]
            if ext in q_by_ext:
                return q_by_ext[ext]
            q = Quiz(**kwargs)
            session.add(q)
            q_by_ext[ext] = q
            return q

        inc = (await session.execute(_select(Movie).where(Movie.external_id=="tt1375666"))).scalars().first()
        inter = (await session.execute(_select(Movie).where(Movie.external_id=="tt0816692"))).scalars().first()

        q1 = ensure_quiz(
            external_id="quiz-inception",
            title="Inception: Dream Levels & Reality",
            description="Test your knowledge of dreams within dreams.",
            number_of_questions=5,
            time_limit_seconds=300,
            pass_score=70,
            is_verification_required=True,
            movie_id=inc.id if inc else None,
        )
        q2 = ensure_quiz(
            external_id="quiz-interstellar",
            title="Interstellar: Space, Time & Gravity",
            description="A quiz about the science and story of Interstellar.",
            number_of_questions=5,
            time_limit_seconds=300,
            pass_score=70,
            is_verification_required=True,
            movie_id=inter.id if inter else None,
        )
        await session.flush()

        # Helper to add questions/options if none exist
        async def ensure_questions_for_inception() -> None:
            existing = (await session.execute(_select(QuizQuestion).where(QuizQuestion.quiz_id==q1.id))).scalars().all()
            if existing:
                return
            qs = [
                ("q1", "How many dream levels are explored in the main mission of Inception?", "multiple-choice", [
                    ("q1-a", "2 levels", False, 0),
                    ("q1-b", "3 levels", False, 1),
                    ("q1-c", "4 levels", True, 2),
                    ("q1-d", "5 levels", False, 3),
                ], 10),
                ("q2", "Which character stays behind in the snow fortress dream level?", "multiple-choice", [
                    ("q2-a", "Cobb", False, 0),
                    ("q2-b", "Arthur", False, 1),
                    ("q2-c", "Eames", True, 2),
                    ("q2-d", "Ariadne", False, 3),
                ], 10),
                ("q3", "Select all the characters who enter the limbo dream state.", "multiple-select", [
                    ("q3-a", "Cobb", True, 0),
                    ("q3-b", "Arthur", False, 1),
                    ("q3-c", "Ariadne", True, 2),
                    ("q3-d", "Saito", True, 3),
                    ("q3-e", "Fischer", True, 4),
                ], 20),
                ("q4", "Cobb's totem is a spinning top.", "true-false", [
                    ("q4-a", "True", True, 0),
                    ("q4-b", "False", False, 1),
                ], 10),
            ]
            order_idx = 0
            for q_ext, text, qtype, opts, pts in qs:
                qq = QuizQuestion(
                    external_id=q_ext,
                    quiz_id=q1.id,
                    text=text,
                    type=qtype,
                    order_index=order_idx,
                    points=pts,
                )
                session.add(qq)
                await session.flush()
                for opt_ext, opt_text, correct, ordx in opts:
                    session.add(
                        QuizQuestionOption(
                            external_id=opt_ext,
                            question_id=qq.id,
                            text=opt_text,
                            is_correct=correct,
                            order_index=ordx,
                        )
                    )
                order_idx += 1

        async def ensure_questions_for_interstellar() -> None:
            existing = (await session.execute(_select(QuizQuestion).where(QuizQuestion.quiz_id==q2.id))).scalars().all()
            if existing:
                return
            qs = [
                ("q1-int", "Which planet has extreme time dilation due to Gargantua?", "multiple-choice", [
                    ("q1-int-a", "Mann's Planet", False, 0),
                    ("q1-int-b", "Edmunds' Planet", False, 1),
                    ("q1-int-c", "Miller's Planet", True, 2),
                    ("q1-int-d", "Cooper's Planet", False, 3),
                ], 10),
                ("q2-int", "'They' are revealed to be future humans.", "true-false", [
                    ("q2-int-a", "True", True, 0),
                    ("q2-int-b", "False", False, 1),
                ], 10),
            ]
            order_idx = 0
            for q_ext, text, qtype, opts, pts in qs:
                qq = QuizQuestion(
                    external_id=q_ext,
                    quiz_id=q2.id,
                    text=text,
                    type=qtype,
                    order_index=order_idx,
                    points=pts,
                )
                session.add(qq)
                await session.flush()
                for opt_ext, opt_text, correct, ordx in opts:
                    session.add(
                        QuizQuestionOption(
                            external_id=opt_ext,
                            question_id=qq.id,
                            text=opt_text,
                            is_correct=correct,
                            order_index=ordx,
                        )
                    )
                order_idx += 1

        await ensure_questions_for_inception()
        await ensure_questions_for_interstellar()
        await session.flush()

        # Sample attempts
        u1 = (await session.execute(_select(User).where(User.external_id=="user-1"))).scalars().first()
        if u1 and q1:
            att = (await session.execute(_select(QuizAttempt).where(QuizAttempt.external_id=="attempt-seed-1"))).scalars().first()
            if not att:
                att = QuizAttempt(
                    external_id="attempt-seed-1",
                    quiz_id=q1.id,
                    user_id=u1.id,
                    attempt_number=1,
                    started_at=datetime.utcnow(),
                )
                session.add(att)
                await session.flush()
                # Mark complete with partial score
                att.completed_at = datetime.utcnow()
                att.time_spent_seconds = 600
                att.score_percent = 60
                att.passed = False
                session.add(QuizLeaderboardEntry(quiz_id=q1.id, user_id=u1.id, score_percent=60, completion_time_seconds=600))
        await session.commit()
        # --- Talent Hub domain seed ---
        from sqlalchemy import select as _select
        from .models import CastingCall, CastingCallRole, SubmissionGuidelines
        from datetime import datetime as _dt

        existing_calls = (await session.execute(_select(CastingCall))).scalars().all()
        by_call = {c.external_id: c for c in existing_calls}

        def ensure_call(**kwargs) -> CastingCall:
            ext = kwargs["external_id"]
            c = by_call.get(ext)
            if c:
                return c
            c = CastingCall(**kwargs)
            session.add(c)
            by_call[ext] = c
            return c

        call1 = ensure_call(
            external_id="call-feature-1",
            project_title="Shadow of the Valley",
            project_type="feature",
            production_company="Aurora Pictures",
            description="A character-driven drama set in the Appalachian Mountains.",
            production_start=_dt(2025, 2, 1),
            production_end=_dt(2025, 4, 30),
            location_city="Asheville",
            location_state="NC",
            location_country="USA",
            budget_range="medium",
            visibility="public",
            submission_deadline=_dt(2025, 1, 15),
            posted_date=_dt(2024, 12, 1),
            poster_image=None,
            is_verified=True,
            status="active",
        )
        await session.flush()
        roles_exist1 = (await session.execute(_select(CastingCallRole.id).where(CastingCallRole.call_id==call1.id))).first()
        if roles_exist1 is None:
            session.add_all([
                CastingCallRole(
                    external_id="role-call1-1",
                    call_id=call1.id,
                    type="acting",
                    title="Lead - Eli",
                    description="Quiet, resilient 30s male lead.",
                    category="lead",
                    department=None,
                    compensation="paid",
                    payment_details="$300/day + lodging",
                    requirements={
                        "ageRange": {"min": 28, "max": 38},
                        "gender": ["male"],
                        "languages": ["English"],
                        "experienceLevel": "professional",
                        "unionStatus": "both",
                    },
                    audition_type="self-tape",
                ),
                CastingCallRole(
                    external_id="role-call1-2",
                    call_id=call1.id,
                    type="crew",
                    title="1st AC",
                    description="Experienced 1st Assistant Camera for remote locations.",
                    category="camera",
                    department="camera",
                    compensation="paid",
                    payment_details="$350/day",
                    requirements={
                        "skills": ["focus pulling", "lens changes"],
                        "experienceLevel": "intermediate",
                        "unionStatus": "both",
                    },
                    audition_type="in-person",
                ),
            ])
            await session.flush()
            session.add(
                SubmissionGuidelines(
                    external_id="sg-call1",
                    call_id=call1.id,
                    required_materials=["headshot", "resume", "reel"],
                    submission_method="email",
                    contact_email="casting@aurorapictures.example",
                    contact_website="https://aurora.example/casting",
                    special_instructions="Include role in subject line",
                )
            )

        call2 = ensure_call(
            external_id="call-tv-1",
            project_title="Metro Nights S2",
            project_type="tv-series",
            production_company="Neon Grid Studios",
            description="Cyber-noir series returns for season 2.",
            production_start=_dt(2025, 3, 10),
            production_end=_dt(2025, 7, 10),
            location_city="Toronto",
            location_state="ON",
            location_country="Canada",
            budget_range="high",
            visibility="public",
            submission_deadline=_dt(2025, 2, 1),
            posted_date=_dt(2024, 12, 5),
            poster_image=None,
            is_verified=True,
            status="active",
        )
        await session.flush()
        roles_exist2 = (await session.execute(_select(CastingCallRole.id).where(CastingCallRole.call_id==call2.id))).first()
        if roles_exist2 is None:
            session.add(
                CastingCallRole(
                    external_id="role-call2-1",
                    call_id=call2.id,
                    type="acting",
                    title="Detective Park",
                    description="Sharp, witty detective, any gender.",
                    category="supporting",
                    department=None,
                    compensation="paid",
                    payment_details="$1200/episode",
                    requirements={
                        "ageRange": {"min": 25, "max": 45},
                        "gender": ["any"],
                        "languages": ["English"],
                        "experienceLevel": "professional",
                        "unionStatus": "sag-aftra",
                    },
                    audition_type="video-call",
                )
            )
            await session.flush()
            session.add(
                SubmissionGuidelines(
                    external_id="sg-call2",
                    call_id=call2.id,
                    required_materials=["headshot", "resume", "slate"],
                    submission_method="website",
                    contact_email=None,
                    contact_website="https://neongrid.example/casting",
                    special_instructions=None,
                )
            )


        # --- Admin domain seed ---
        from sqlalchemy import select as _select
        from .models import AdminUserMeta, ModerationItem, SystemSettings, AdminMetricSnapshot
        from datetime import datetime as _dt

        # Admin users meta
        u1 = (await session.execute(_select(User).where(User.external_id=="user-1"))).scalars().first()
        u2 = (await session.execute(_select(User).where(User.external_id=="user-2"))).scalars().first()
        if u1:
            existing_meta = (await session.execute(_select(AdminUserMeta).where(AdminUserMeta.user_id==u1.id))).scalars().first()
            if not existing_meta:
                session.add(AdminUserMeta(user_id=u1.id, email="user1@example.com", roles=["User","Moderator"], status="Active", joined_date=_dt(2024,1,1)))
        if u2:
            existing_meta2 = (await session.execute(_select(AdminUserMeta).where(AdminUserMeta.user_id==u2.id))).scalars().first()
            if not existing_meta2:
                session.add(AdminUserMeta(user_id=u2.id, email="user2@example.com", roles=["User"], status="Active", joined_date=_dt(2024,2,1)))

        # Moderation items
        m_exists = (await session.execute(_select(ModerationItem))).scalars().first()
        if not m_exists and u2:
            session.add_all([
                ModerationItem(
                    external_id="mod-1",
                    content_type="review",
                    content_title="Nolan's Best Work",
                    report_reason="spam",
                    status="flagged",
                    reporter_count=3,
                    created_at=_dt(2024,12,10,10,0),
                    user_id=u2.id,
                    content_ref="review-2",
                ),
                ModerationItem(
                    external_id="mod-2",
                    content_type="pulse",
                    content_title="Excited to announce that Oppenheimer...",
                    report_reason="abusive",
                    status="pending",
                    reporter_count=5,
                    created_at=_dt(2024,12,11,9,30),
                    user_id=u2.id,
                    content_ref="pulse-1",
                ),
            ])

        # System settings default
        s = (await session.execute(_select(SystemSettings).where(SystemSettings.external_id=="default"))).scalars().first()
        if not s:
            session.add(SystemSettings(external_id="default", data={
                "general": {"siteName": "CineVerse", "maintenanceMode": False, "analyticsId": "GA-XXXX"},
                "content": {"enableUserReviews": True, "reviewModeration": "post", "enableComments": True},
                "security": {"enableTwoFactorAuth": False, "requireEmailVerification": True},
                "notifications": {"enableEmailNotifications": True, "adminEmailRecipients": ["admin@cineverse.example"]},
            }))

        # Analytics snapshot
        snap_exists = (await session.execute(_select(AdminMetricSnapshot))).scalars().first()
        if not snap_exists:
            session.add(AdminMetricSnapshot(metrics={
                "totalUsers": 24892,
                "contentViews": 1200000,
                "avgRating": 4.7,
                "systemHealth": 99.8,
                "changes": {"totalUsers": 12.5, "contentViews": 18.2, "avgRating": 2.3, "systemHealth": -0.1}
            }))


        # --- Notifications domain seed ---
        from .models import Notification, NotificationPreference

        # Notifications for user-1
        if u1:
            n_any = (await session.execute(_select(Notification).where(Notification.user_id==u1.id))).scalars().first()
            if not n_any:
                session.add_all([
                    Notification(
                        external_id="notif-001",
                        user_id=u1.id,
                        type="social",
                        title="New Connection Request",
                        message="Director Ava Chen has sent you a connection request.",
                        action_url="/connections/requests",
                        meta={"userId":"user-123","userName":"Ava Chen"},
                        is_read=False,
                    ),
                    Notification(
                        external_id="notif-002",
                        user_id=u1.id,
                        type="release",
                        title="New Film Release",
                        message='"The Last Horizon" is now available to watch on streaming platforms.',
                        action_url="/movies/the-last-horizon",
                        meta={"movieId":"movie-456","movieTitle":"The Last Horizon"},
                        is_read=True,
                    ),
                    Notification(
                        external_id="notif-003",
                        user_id=u1.id,
                        type="system",
                        title="Profile Verification Complete",
                        message="Your talent profile has been successfully verified.",
                        action_url="/talent-hub/profile/me",
                        is_read=False,
                    ),
                    Notification(
                        external_id="notif-004",
                        user_id=u1.id,
                        type="club",
                        title="New Discussion in Filmmakers Club",
                        message='New topic: "The Future of Independent Cinema" has been started in your club.',
                        action_url="/clubs/filmmakers/discussions/future-indie-cinema",
                        meta={"clubId":"club-789","clubName":"Filmmakers Club"},
                        is_read=False,
                    ),
                    Notification(
                        external_id="notif-005",
                        user_id=u1.id,
                        type="quiz",
                        title="New Film Knowledge Quiz",
                        message='Test your knowledge with our new quiz: "Classic Cinema Masterpieces"',
                        action_url="/quiz/classic-cinema",
                        meta={"quizId":"quiz-101","quizTitle":"Classic Cinema Masterpieces"},
                        is_read=True,
                    ),
                ])
        # Preferences default for user-1
        if u1:
            pref = (await session.execute(_select(NotificationPreference).where(NotificationPreference.user_id==u1.id))).scalars().first()
            if not pref:
                session.add(NotificationPreference(
                    user_id=u1.id,
                    channels={
                        "social": {"inApp": True, "email": True, "push": True},
                        "releases": {"inApp": True, "email": True, "push": True},
                        "system": {"inApp": True, "email": False, "push": False},
                        "clubs": {"inApp": True, "email": True, "push": False},
                        "quizzes": {"inApp": True, "email": False, "push": False},
                        "messages": {"inApp": True, "email": True, "push": True},
                        "events": {"inApp": True, "email": True, "push": True},
                    },
                    global_settings={
                        "emailFrequency": "daily",
                        "pushEnabled": True,
                        "emailEnabled": True,
                        "inAppEnabled": True,
                        "dndEnabled": False,
                        "dndStartTime": "22:00",
                        "dndEndTime": "08:00",
                        "notificationVolume": 70,
                    }
                ))


        # --- Settings domain seed ---
        from sqlalchemy import select as _select
        from .models import UserSettings

        if u1:
            existing_settings1 = (
                await session.execute(_select(UserSettings).where(UserSettings.user_id == u1.id))
            ).scalars().first()
            if not existing_settings1:
                session.add(
                    UserSettings(
                        user_id=u1.id,
                        account={"name": "CinemaEnthusiast", "email": "user1@example.com", "phone": None, "avatar": None, "bio": None},
                        profile={"username": "cinemaenth", "fullName": "Cinema Enthusiast", "avatarUrl": None, "bio": "Love films."},
                        privacy={"profileVisibility": "public", "activitySharing": True, "messageRequests": "everyone", "dataDownloadRequested": False},
                        display={"theme": "dark", "fontSize": "medium", "highContrastMode": False, "reduceMotion": False},
                        preferences={"language": "en", "region": "us", "hideSpoilers": True, "excludedGenres": [], "contentRating": "all"},
                        security={"twoFactorEnabled": False, "loginNotifications": True},
                        integrations={"facebook": False, "twitter": False, "instagram": False},
                        data={"deletionRequested": False, "exportRequested": False, "lastExportAt": None},
                    )
                )
        if u2:
            existing_settings2 = (
                await session.execute(_select(UserSettings).where(UserSettings.user_id == u2.id))
            ).scalars().first()
            if not existing_settings2:
                session.add(
                    UserSettings(
                        user_id=u2.id,
                        account={"name": "FilmCritic101", "email": "user2@example.com", "phone": None, "avatar": None, "bio": "Critic."},
                        profile={"username": "filmcritic", "fullName": "Film Critic", "avatarUrl": None, "bio": "Critic."},
                        privacy={"profileVisibility": "followers", "activitySharing": True, "messageRequests": "followers", "dataDownloadRequested": False},
                        display={"theme": "dark", "fontSize": "medium", "highContrastMode": False, "reduceMotion": False},
                        preferences={"language": "en", "region": "us", "hideSpoilers": True, "excludedGenres": [], "contentRating": "all"},
                        security={"twoFactorEnabled": False, "loginNotifications": True},
                        integrations={"facebook": False, "twitter": False, "instagram": False},
                        data={"deletionRequested": False, "exportRequested": False, "lastExportAt": None},
                    )
                )

        await session.commit()

        print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())

