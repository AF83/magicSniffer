(ns test-fileAPI.input
  (:require [clj-webdriver.taxi :refer :all]
            [clojure.test :refer :all])
  (:import [java.io File]))



;; the location of the html file for the test to launch for these tests.
(def html-base (str "file://"
               (.getAbsolutePath (File. ""))
               "/test/resources/input.html"))

;; several binaries with different magical signatures
(def files ["true.bmp"
            "true.jpg"
            "true.png"
            "true.psd"
            "true.tiff"])

(def paths (map (partial str
                         (.getAbsolutePath (File. ""))
                         "/test/resources/assets/")
                files))

(def driver (new-driver {:browser :firefox}))

(defn done-reading? []
  (execute-script "return !!format;"))

(deftest input-bmp
  (set-driver! driver)

  (to html-base)

  ;; send-keys command will trigger a change on the input DOM node
  (send-keys "input[type=file]" (first paths))
  ;; readAsArrayBuffer is an asynchronous function, we must make sure
  ;; the sniffing as occured before going on
  (wait-until done-reading?)
  (is (= "bmp" (execute-script "return format;"))))
