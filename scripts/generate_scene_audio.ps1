Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SelectVoice("Microsoft Zira Desktop")
$synth.Rate = 1

$scenes = @(
    @{ Name = "scene1.wav"; Text = "Here is how I built a luxury e-commerce experience for Reflection Elite with zero monthly subscriptions." },
    @{ Name = "scene2.wav"; Text = "The design features refined aesthetics, gold-accented typography, and high-resolution galleries crafted for luxury mirrors." },
    @{ Name = "scene3.wav"; Text = "A dynamic product management engine powers live variation switches between frame dimensions and finishes with real-time price updates." },
    @{ Name = "scene4.wav"; Text = "The checkout is optimized for Indian buyers, with mandatory six-digit PIN code validation, cash on delivery, and instant UPI and card payments via Razorpay." },
    @{ Name = "scene5.wav"; Text = "By migrating from Shopify to a custom self-hosted WooCommerce architecture, the client saves over twenty-five thousand rupees every year." }
)

foreach ($s in $scenes) {
    $outPath = Join-Path "scripts" $s.Name
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($s.Text)
    Write-Output "Generated $($s.Name)"
}

$synth.Dispose()
