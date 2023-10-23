// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use rodio::{OutputStream, Sink};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};
use tauri::Manager;

#[tauri::command]
fn play_sound() {
    let (_stream, stream_handle) = OutputStream::try_default().unwrap();
  let sink = Sink::try_new(&stream_handle).unwrap();

  if cfg!(target_os = "windows") {
    let path = "C:\\Windows\\Media\\notify.wav";
    let file = File::open(path).unwrap();
    sink.append(rodio::Decoder::new(file).unwrap());
  } else if cfg!(target_os = "macos") {
    let path = "/System/Library/Sounds/Glass.aiff";
    let file = File::open(path).unwrap();
    sink.append(rodio::Decoder::new(file).unwrap());
  } else {
    let path = "/usr/share/sounds/freedesktop/stereo/message.oga";
    let file = File::open(path).unwrap();
    sink.append(rodio::Decoder::new(file).unwrap());
  }
  std::thread::sleep(std::time::Duration::from_secs(1));
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_sound])
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
