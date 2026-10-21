Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoiceByHints([System.Speech.Synthesis.VoiceGender]::Female)
$synth.Rate = 0
$synth.SetOutputToWaveFile("test_voice.wav")
$synth.Speak("Here is how I engineered a bespoke luxury e-commerce experience for Reflection Elite with zero monthly subscriptions.")
$synth.Dispose()
Write-Output "Voice generated successfully!"
