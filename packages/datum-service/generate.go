package main

//go:generate echo "------> Generating code - running entc.go... <------"
//go:generate go run -mod=mod ./internal/ent/entc.go
//go:generate go mod tidy
//go:generate echo "------> Code generation process completed! <------"
