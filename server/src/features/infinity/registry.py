from typing import Type, Any
from .base import ModeType, ModeConfig
from .impls import (
    StandardMode,
    InterviewMode,
    FirstPrinciplesMode,
    PracticalMode,
    ComparativeMode,
    QuizMode,
    VisualMode
)


class ModeRegistry:
    """Registry for managing all available learning modes."""

    _modes: dict[ModeType, Type[ModeConfig]] = {
        ModeType.STANDARD: StandardMode,
        ModeType.INTERVIEW: InterviewMode,
        ModeType.FIRST_PRINCIPLES: FirstPrinciplesMode,
        ModeType.PRACTICAL: PracticalMode,
        ModeType.COMPARATIVE: ComparativeMode,
        ModeType.QUIZ: QuizMode,
        ModeType.VISUAL: VisualMode,
    }

    @classmethod
    def get_mode(cls, mode_type: ModeType) -> ModeConfig:
        """Get a mode instance by its type."""
        if mode_type not in cls._modes:
            raise ValueError(f"Unknown mode type: {mode_type}")

        mode_class = cls._modes[mode_type]
        return mode_class()

    @classmethod
    def get_all_modes(cls) -> list[ModeConfig]:
        """Get instances of all registered modes."""
        return [mode_class() for mode_class in cls._modes.values()]

    @classmethod
    def register_mode(cls, mode_type: ModeType, mode_class: Type[ModeConfig]) -> None:
        """Register a new mode type."""
        cls._modes[mode_type] = mode_class

    @classmethod
    def serialize_all_modes(cls) -> list[dict[str, Any]]:
        """Serialize all modes for API responses."""
        return [mode.serialize() for mode in cls.get_all_modes()]


def get_mode(mode_type: str) -> ModeConfig:
    """
    Retrieves a mode instance based on its type string.

    This function attempts to convert the provided string into a ModeType enum and then uses the ModeRegistry to get an instance of the corresponding mode. If the conversion fails or the mode type is unknown, it raises a ValueError.

    Args:
        mode_type (str): The string representation of the mode type.

    Returns:
        ModeConfig: An instance of the mode configuration.

    Raises:
        ValueError: If the mode type string is invalid or does not correspond to a known mode type.
    """
    try:
        mode_enum = ModeType(mode_type)
        return ModeRegistry.get_mode(mode_enum)
    except ValueError:
        raise ValueError(f"Unknown mode type: {mode_type}")
