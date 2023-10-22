// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::File;
use rodio::{OutputStream, Sink};

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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
