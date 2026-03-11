"use client";

import { useMemo, useState } from "react";

type StyleKey = "toon" | "real" | "movie" | "animation3d";

const STYLE_LABELS: Record<StyleKey, { title: string; desc: string }> = {
  toon: {
    title: "만화 / 일러스트",
    desc: "웹툰, 애니 느낌의 깔끔한 그림체",
  },
  real: {
    title: "실사",
    desc: "진짜 사진처럼 보이는 리얼한 이미지",
  },
  movie: {
    title: "영화",
    desc: "필름 느낌의 시네마틱 장면",
  },
  animation3d: {
    title: "3D 애니메이션",
    desc: "픽사/디즈니 느낌의 3D 캐릭터",
  },
};

const STYLE_PROMPTS: Record<StyleKey, string> = {
  toon:
    "2D illustration style, clean line art, vibrant colors, cel shaded, digital art, bold outlines, flat color fill, screen tone, speed lines, emotion marks, fully filled background",
  real:
    "photographic style, realistic textures, natural lighting, highly detailed environment, grounded composition, fully filled background",
  movie:
    "cinematic film still style, dramatic composition, strong visual storytelling, atmospheric background, emotionally expressive staging",
  animation3d:
    "3D animated family-film style, appealing character shapes, polished stylized environment, expressive poses, colorful full background",
};

export default function Home() {
  const [selectedStyle, setSelectedStyle] = useState<StyleKey>("toon");
  const [imageRule, setImageRule] = useState("3문장 = 1이미지");
  const [characterRule, setCharacterRule] = useState("등장");
  const [ethnicityRule, setEthnicityRule] = useState("자동");
  const [script, setScript] = useState("");

  const systemPrompt = useMemo(() => {
    return `당신은 Nano Banana(Google Flow) 이미지 생성용 프롬프트 전문가입니다.
아래 대본을 읽고, ${imageRule.replace("=", "당 ")}를 시간순으로 작성하세요.

[스타일]
${STYLE_PROMPTS[selectedStyle]}

[공통 규칙]
1. 대본을 시간순으로 분석할 것
2. 캐릭터: ${characterRule}
3. 인물 민족: ${ethnicityRule}
4. 배경은 반드시 완전히 채울 것
5. 대사가 있으면 글자로 쓰지 말고 표정과 행동으로 표현
6. 모든 프롬프트 끝에 "no watermarks" 추가
7. 출력은 영어 프롬프트 위주로 작성

[출력 형식]
## Image 1
**IMG**: ...
**VID**: ...
**KR**: ...

대본이 길 경우 20개씩 끊어서 출력하세요.
20개를 출력할 때마다 바로 .txt 파일 2개를 제공하고, "계속 하시려면 [계속]이라고 입력하세요" 라고 안내한 뒤 멈추세요.

.txt 파일 형식:
1. image-prompts.txt — IMG 프롬프트만. 프롬프트 사이에 빈 줄 1개씩 넣어서 구분
2. video-prompts.txt — VID 프롬프트만. 프롬프트 사이에 빈 줄 1개씩 넣어서 구분`;
  }, [selectedStyle, imageRule, characterRule, ethnicityRule]);

  const finalCombinedPrompt = useMemo(() => {
    return `${systemPrompt}

[대본]
${script || "(여기에 대본을 붙여넣으세요)"}`;
  }, [systemPrompt, script]);

  const handleCopyPromptOnly = async () => {
    try {
      await navigator.clipboard.writeText(systemPrompt);
      alert("시스템 프롬프트를 복사했어.");
    } catch {
      alert("복사에 실패했어.");
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(finalCombinedPrompt);
      alert("프롬프트와 대본 전체를 복사했어.");
    } catch {
      alert("복사에 실패했어.");
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0b14] text-white">
      <div className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-4xl font-bold tracking-tight">Flow Prompt Builder</h1>
        <p className="mt-3 text-sm text-zinc-300">
          Nano Banana(Flow) 이미지 프롬프트 생성기 — 옵션 선택 → 복사 → LLM에 대본과 함께 붙여넣기
        </p>

        <section className="mt-8 rounded-2xl border border-[#2b2b44] bg-[#141424] p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
              1
            </div>
            <h2 className="text-lg font-semibold">스타일 선택</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(Object.keys(STYLE_LABELS) as StyleKey[]).map((key) => {
              const item = STYLE_LABELS[key];
              const active = selectedStyle === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedStyle(key)}
                  className={`rounded-xl border p-5 text-left transition ${
                    active
                      ? "border-violet-500 bg-[#1d1b36] ring-1 ring-violet-400"
                      : "border-[#32324a] bg-[#1b1b2d] hover:border-violet-400"
                  }`}
                >
                  <div className="text-xl font-bold">{item.title}</div>
                  <div className="mt-2 text-sm text-zinc-300">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#2b2b44] bg-[#141424] p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
              2
            </div>
            <h2 className="text-lg font-semibold">옵션 설정</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm text-zinc-300">몇 문장당 이미지 1장</label>
              <select
                value={imageRule}
                onChange={(e) => setImageRule(e.target.value)}
                className="w-full rounded-xl border border-[#32324a] bg-[#1b1b2d] px-4 py-3 text-white outline-none"
              >
                <option>3문장 = 1이미지</option>
                <option>2문장 = 1이미지</option>
                <option>1문장 = 1이미지</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">캐릭터 등장</label>
              <select
                value={characterRule}
                onChange={(e) => setCharacterRule(e.target.value)}
                className="w-full rounded-xl border border-[#32324a] bg-[#1b1b2d] px-4 py-3 text-white outline-none"
              >
                <option>등장</option>
                <option>상황에 따라</option>
                <option>최소화</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-300">인물 민족</label>
              <select
                value={ethnicityRule}
                onChange={(e) => setEthnicityRule(e.target.value)}
                className="w-full rounded-xl border border-[#32324a] bg-[#1b1b2d] px-4 py-3 text-white outline-none"
              >
                <option>자동</option>
                <option>동아시아</option>
                <option>서양인</option>
                <option>혼합</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#2b2b44] bg-[#141424] p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
              3
            </div>
            <h2 className="text-lg font-semibold">대본 입력</h2>
          </div>

          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="여기에 대본을 붙여넣어..."
            className="h-[260px] w-full resize-none rounded-xl border border-[#32324a] bg-[#0c0c14] p-4 text-sm leading-7 text-zinc-200 outline-none"
          />
        </section>

        <section className="mt-6 rounded-2xl border border-[#2b2b44] bg-[#141424] p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 text-sm font-bold">
              4
            </div>
            <h2 className="text-lg font-semibold">완성된 프롬프트 — 복사 후 LLM에 붙여넣기</h2>
          </div>

          <div className="rounded-xl border border-[#32324a] bg-[#10101a] p-4">
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleCopyPromptOnly}
                className="rounded-lg bg-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                프롬프트만 복사
              </button>
              <button
                type="button"
                onClick={handleCopyAll}
                className="rounded-lg bg-violet-500 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-400"
              >
                프롬프트 + 대본 전체 복사
              </button>
            </div>

            <textarea
              readOnly
              value={finalCombinedPrompt}
              className="mt-3 h-[420px] w-full resize-none rounded-lg border border-[#32324a] bg-[#0c0c14] p-4 text-sm leading-7 text-zinc-200 outline-none"
            />
          </div>
        </section>
      </div>
    </main>
  );
}