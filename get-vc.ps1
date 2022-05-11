$vswhereDir = "$env:ProgramFiles\Microsoft Visual Studio\Installer\vswhere.exe"
if (${env:ProgramFiles(x86)} -ne $null -and !(test-path $vswhereDir)) {
  $vswhereDir = join-path ${env:ProgramFiles(x86)} 'Microsoft Visual Studio\Installer\vswhere.exe'
}
if (!(test-path $vswhereDir)) { $vswhereDir = "$env:ProgramData\chocolatey\lib\vswhere\tools\vswhere.exe" }
if (!(test-path $vswhereDir)) { exit 1 }

$installDir = & $vswhereDir -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
if ($installDir) {
  $path = join-path $installDir 'VC\Auxiliary\Build\Microsoft.VCToolsVersion.default.txt'
  if (test-path $path) {
    $version = gc -raw $path
    if ($version) {
      $version = $version.Trim()
      write-output $version
      write-output (join-path $installDir "VC\Tools\MSVC\$version\bin\Hostx64\x64\cl.exe")
    }
  }
}