(ns test-fileAPI.input
  (:require [clj-webdriver.taxi :refer :all]
            [clojure.test :refer :all])
  (:import [java.io File]))



(def path (str "file://"
               (.getAbsolutePath (File. ""))
               "/test/resources/input.html"))

(deftest input-psd
  (set-driver! {:browser :firefox})
  (to path)
  (is (displayed? "#pouet")))
