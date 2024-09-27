package projects

import (
	"context"

	"cloud.google.com/go/longrunning/autogen/longrunningpb"
	resourcemanagerpb "go.datumapis.com/genproto/os/resourcemanager/v1alpha"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Server struct {
	resourcemanagerpb.UnimplementedProjectsServer
}

func (p *Server) CreateProject(ctx context.Context, req *resourcemanagerpb.CreateProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Server) DeleteProject(ctx context.Context, req *resourcemanagerpb.DeleteProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Server) UpdateProject(ctx context.Context, req *resourcemanagerpb.UpdateProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Server) ListProjects(ctx context.Context, req *resourcemanagerpb.ListProjectsRequest) (*resourcemanagerpb.ListProjectsResponse, error) {
	return &resourcemanagerpb.ListProjectsResponse{}, nil
}

func (p *Server) GetProject(ctx context.Context, req *resourcemanagerpb.GetProjectRequest) (*resourcemanagerpb.Project, error) {
	return &resourcemanagerpb.Project{
		Name:        req.Name,
		Uid:         "80f3377e-e0b4-4f70-b47a-419d02505e8a",
		Parent:      "organizations/datum.net",
		CreateTime:  timestamppb.Now(),
		DisplayName: "Datum, Inc",
		Etag:        "W/fsdffsg",
	}, nil
}

func (p *Server) MoveProject(ctx context.Context, req *resourcemanagerpb.MoveProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}
