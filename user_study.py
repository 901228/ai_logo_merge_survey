from typing import Tuple


def gen_list():
    questions = []
    for i in range(1, 51):
        q_id = f"q{i:03d}"
        questions.append(
            {
                "id": q_id,
                "logo": f"images/questions/{q_id}/logo.png",
                "material": f"images/questions/{q_id}/texture.png",
                "options": [
                    {
                        "value": "ours",
                        "image": f"images/questions/{q_id}/ours.png",
                    },
                    {
                        "value": "stf",
                        "image": f"images/questions/{q_id}/stf.png",
                    },
                    {
                        "value": "material_fusion",
                        "image": f"images/questions/{q_id}/material_fusion.png",
                    },
                    {
                        "value": "controlnet",
                        "image": f"images/questions/{q_id}/controlnet.png",
                    },
                    {
                        "value": "ip_adapter",
                        "image": f"images/questions/{q_id}/ip_adapter.png",
                    },
                ],
            }
        )

    import json

    print(json.dumps(questions, indent=2))


def make_list():
    import csv
    import shutil
    from pathlib import Path
    from typing import List

    from tqdm import tqdm

    ROOT = Path(__file__).parent / ".." / ".."
    WORKDIR = ROOT / "workdir" / "222logos"
    OURS = WORKDIR / "inference" / "ours"
    STF = WORKDIR / "baselines" / "stf" / "results"
    MATERIAL_FUSION = WORKDIR / "baselines" / "material_fusion" / "results"
    CONTROLNET = WORKDIR / "baselines" / "controlnet" / "results"
    IP_ADAPTER = WORKDIR / "baselines" / "ip_adapter" / "results"

    LOGOS = ROOT / "data" / "logos" / "image"
    TEXTURES = ROOT / "data" / "textures" / "image"

    images: List[Tuple[str, str, str]] = []
    with open(Path(__file__).parent / "list.csv", "r") as f:
        reader = csv.reader(f)
        for row in [row for row in reader][1:]:
            if not row:
                continue
            images.append(row)  # type: ignore

    images_root = Path(__file__).parent / "images" / "questions"
    images_root.mkdir(exist_ok=True, parents=True)

    for i, (logo, texture, result) in enumerate(tqdm(images)):
        dest = images_root / f"q{i + 1:03d}"
        dest.mkdir(exist_ok=True, parents=True)

        result = f"{result}.png"
        shutil.copy(OURS / texture / f"{logo}.png", dest / "ours.png")

        shutil.copy(CONTROLNET / result, dest / "controlnet.png")
        shutil.copy(IP_ADAPTER / result, dest / "ip_adapter.png")

        result = result.replace("brass_convex", "brass_convex_nobbox_0_60").replace(
            "chain_stitch_white_padding_outpainting", "chain_stitch_white_padding_outpainting_nobbox_0_60"
        )
        shutil.copy(STF / result, dest / "stf.png")
        shutil.copy(MATERIAL_FUSION / result, dest / "material_fusion.png")

        shutil.copy(LOGOS / f"{logo}.png", dest / "logo.png")
        shutil.copy(TEXTURES / f"{texture}.png", dest / "texture.png")


if __name__ == "__main__":
    # gen_list()
    make_list()
