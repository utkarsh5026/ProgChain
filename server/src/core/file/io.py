
from pathlib import Path
import aiofiles


BASE_FILE_DIR = Path(__file__).parent.parent.parent.parent / "project_files"
BASE_FILE_DIR.mkdir(parents=True, exist_ok=True)


async def write_file(file_name: str, file_content: str | bytes) -> str:
    """
        Asynchronously writes file content to the specified file name.
        Depending on the type of file_content provided:
        - If file_content is a str (for text or code file), this method opens the file in text mode ("w") so that
          Python handles the encoding automatically.
        - If file_content is already bytes, or if you prefer manual encoding, you can open the file in binary mode ("wb").
    """
    file_path = BASE_FILE_DIR / file_name

    if isinstance(file_content, str):
        async with aiofiles.open(file_path, mode='w', encoding='utf-8') as file:
            await file.write(file_content)
    else:
        async with aiofiles.open(file_path, mode='wb') as file:
            await file.write(file_content)

    return str(file_path)


async def read_file(file_path: str) -> bytes:
    async with aiofiles.open(file_path, mode='rb') as file:
        return await file.read()
