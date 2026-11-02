# Source and license review

Checked 2026-11-02. These are locally generated candidate recordings of original
WordQuest text, not copied dictionary recordings or cloned user voices.

| Component | Official evidence | Status |
| --- | --- | --- |
| Kokoro-82M v1.0 weights / preset voice parameters | https://huggingface.co/hexgrad/Kokoro-82M ; https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md | Model card marks Apache-2.0; voice list categorizes af_heart and af_bella as American English. No model/voice binaries shipped in this sample. |
| Kokoro source license | https://github.com/hexgrad/kokoro/blob/main/LICENSE | Full Apache-2.0 notice retained in kokoro-APACHE-2.0.txt. |
| kokoro-onnx 0.4.9 tool | https://github.com/thewh1teagle/kokoro-onnx | MIT tool; upstream README separately identifies model as Apache-2.0. MIT notice and README snapshot retained. |
| Actual ONNX model download | https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx | Linked by upstream README; actual file hash in audio-manifest.json. |
| Actual preset voice download | https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin | Linked by upstream README; actual file hash in audio-manifest.json. |

The model-card hash identifies its original checkpoint, not this ONNX export; do
not equate them. `sources.json` records URLs/retrieval times/hashes for the saved
official notices/README. The card and voice table were also checked through the
available web tool; their URLs above remain the source for those classifications.

Offline redistribution is supported by the reviewed permissive model/tool
licenses, retaining notices. No paid service terms, streaming-only dictionary
audio or third-party human performance is being reused. Licenses grant usage
rights; they are not a quality certification, endorsement, trademark permission,
or proof that synthesized output has a particular copyright status everywhere.

For transparency, the model card credits training datasets including Koniwa
(CC BY 3.0) and SIWIS (CC BY 4.0): see its Creative Commons Attribution section.
This package does not include copies of those source recordings or their voices
as a separately sourced human recording. Preserve this provenance with samples.

Generation-only dependencies (ONNX Runtime, phonemizer/eSpeak-NG and NumPy) live
in the temporary virtual environment; their engines, code and data are not in the
sample or PWA. The generator disables ONNX Runtime telemetry and synthesis runs
under the network-restricted shell. The sample page contains no telemetry or
external resources. Model names/quality grades are not substituted for listening.
