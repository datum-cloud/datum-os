package resourcemanager

import (
	"context"

	"cloud.google.com/go/longrunning/autogen/longrunningpb"
	resourcemanagerpb "go.datumapis.com/genproto/os/resourcemanager/v1alpha"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type Projects struct {
	resourcemanagerpb.UnimplementedProjectsServer
}

func (p *Projects) CreateProject(ctx context.Context, req *resourcemanagerpb.CreateProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Projects) DeleteProject(ctx context.Context, req *resourcemanagerpb.DeleteProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Projects) UpdateProject(ctx context.Context, req *resourcemanagerpb.UpdateProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}

func (p *Projects) ListProjects(ctx context.Context, req *resourcemanagerpb.ListProjectsRequest) (*resourcemanagerpb.ListProjectsResponse, error) {
	return &resourcemanagerpb.ListProjectsResponse{}, nil
}

func (p *Projects) GetProject(ctx context.Context, req *resourcemanagerpb.GetProjectRequest) (*resourcemanagerpb.Project, error) {
	return &resourcemanagerpb.Project{
		Name:        req.Name,
		Uid:         "80f3377e-e0b4-4f70-b47a-419d02505e8a",
		Parent:      "organizations/datum.net",
		CreateTime:  timestamppb.Now(),
		DisplayName: "Datum, Inc",
		Etag:        "W/fsdffsg",
	}, nil
}

func (p *Projects) MoveProject(ctx context.Context, req *resourcemanagerpb.MoveProjectRequest) (*longrunningpb.Operation, error) {
	return &longrunningpb.Operation{}, nil
}
