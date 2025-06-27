import asyncio
import os

from TikTokApi import TikTokApi

ms_token = os.environ.get(
    "ms_token",
    "5JSo1Yr1ZA9fh4GQ0octjFRaxmTxFPnga5JCZTlrr-Qj4FUkq7zEmjbvrU4SmoECL89A7fEmzBzgzZT0WUoamMjCdn1vRT8ujkOBxixJsO-UQ2ymIZGe21D_u3Fpl_1VM-7dTgYRQkXTM_fdmMz7zZL8",
)  # get your own ms_token from your cookies on tiktok.com


async def trending_videos():
    async with TikTokApi() as api:
        await api.create_sessions(
            ms_tokens=[ms_token],
            num_sessions=1,
            sleep_after=3,
            browser=os.getenv("TIKTOK_BROWSER", "chromium"),
        )
        async for video in api.trending.videos(count=30):
            print(video)
            print(video.as_dict)


if __name__ == "__main__":
    asyncio.run(trending_videos())
